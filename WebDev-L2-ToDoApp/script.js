/**
 * OIBSIP Level 2 Task 3: TaskFlow Pro (To-Do Web App)
 * Single source of truth task model with localStorage synchronization,
 * inline editing, timestamps, and dual pending/completed views.
 */

(() => {
  'use strict';

  const STORAGE_KEY = 'oibsip_taskflow_tasks_v1';

  // State
  let tasks = [];
  let searchQuery = '';
  let editingTaskId = null;

  // DOM Elements
  const form = document.getElementById('todoForm');
  const taskTextInput = document.getElementById('taskTextInput');
  const taskPrioritySelect = document.getElementById('taskPrioritySelect');
  const inputErrorMsg = document.getElementById('inputErrorMsg');
  const searchInput = document.getElementById('searchInput');
  const clearCompletedBtn = document.getElementById('clearCompletedBtn');

  // Lists & Counters
  const pendingTaskList = document.getElementById('pendingTaskList');
  const completedTaskList = document.getElementById('completedTaskList');
  const pendingCount = document.getElementById('pendingCount');
  const completedCount = document.getElementById('completedCount');
  const pendingEmptyState = document.getElementById('pendingEmptyState');
  const completedEmptyState = document.getElementById('completedEmptyState');
  const currentDateDisplay = document.getElementById('currentDateDisplay');

  // Edit Modal Dialog
  const editDialog = document.getElementById('editDialog');
  const editForm = document.getElementById('editForm');
  const editTaskInput = document.getElementById('editTaskInput');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  /**
   * Safe localStorage Loader with corrupted data recovery
   */
  function loadTasksFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        // Initial seed tasks to provide immediate value to reviewers
        return [
          {
            id: 'task-seed-1',
            text: 'Complete OIBSIP Task Submission and record demo video',
            priority: 'high',
            completed: false,
            createdAt: Date.now() - 1000 * 60 * 60 * 2,
            completedAt: null
          },
          {
            id: 'task-seed-2',
            text: 'Verify responsive breakpoints on mobile and tablet screens',
            priority: 'medium',
            completed: true,
            createdAt: Date.now() - 1000 * 60 * 60 * 5,
            completedAt: Date.now() - 1000 * 60 * 30
          }
        ];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (err) {
      console.warn('Corrupt local storage data encountered, resetting tasks:', err);
      return [];
    }
  }

  /**
   * Persist current task array into localStorage
   */
  function saveTasksToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to write to localStorage:', err);
    }
  }

  /**
   * Format human-friendly timestamp (e.g. "Today at 2:30 PM")
   */
  function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  /**
   * Render single task card HTML
   */
  function createTaskCardElement(task) {
    const li = document.createElement('li');
    li.className = `task-card ${task.completed ? 'completed-item' : ''}`;
    li.setAttribute('data-id', task.id);

    const timeLabel = task.completed
      ? `Completed: ${formatTimestamp(task.completedAt)}`
      : `Added: ${formatTimestamp(task.createdAt)}`;

    li.innerHTML = `
      <input 
        type="checkbox" 
        class="task-checkbox" 
        ${task.completed ? 'checked' : ''} 
        aria-label="Toggle task completion status" 
      />
      <div class="task-info">
        <div class="task-title-row">
          <span class="task-text">${escapeHtml(task.text)}</span>
          <span class="priority-tag priority-${task.priority}">${task.priority}</span>
        </div>
        <span class="task-meta-time">${timeLabel}</span>
      </div>
      <div class="task-actions">
        <button type="button" class="btn-icon btn-edit" title="Edit task title">EDIT</button>
        <button type="button" class="btn-icon btn-delete" title="Delete task permanently">&times;</button>
      </div>
    `;

    return li;
  }

  /**
   * Simple HTML escaping helper for user-generated strings
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Main Render Pipeline: Updates counts, filters, and renders both columns
   */
  function render() {
    pendingTaskList.innerHTML = '';
    completedTaskList.innerHTML = '';

    // Filter by search query
    const filtered = tasks.filter(t => 
      t.text.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

    const pending = filtered.filter(t => !t.completed);
    const completed = filtered.filter(t => t.completed);

    // Update Counts
    const totalPending = tasks.filter(t => !t.completed).length;
    const totalCompleted = tasks.filter(t => t.completed).length;

    pendingCount.textContent = totalPending;
    completedCount.textContent = totalCompleted;

    // Render Pending Items
    if (pending.length === 0) {
      pendingEmptyState.style.display = 'flex';
    } else {
      pendingEmptyState.style.display = 'none';
      pending.forEach(task => {
        pendingTaskList.appendChild(createTaskCardElement(task));
      });
    }

    // Render Completed Items
    if (completed.length === 0) {
      completedEmptyState.style.display = 'flex';
    } else {
      completedEmptyState.style.display = 'none';
      completed.forEach(task => {
        completedTaskList.appendChild(createTaskCardElement(task));
      });
    }

    saveTasksToStorage();
  }

  /**
   * Add new task handler
   */
  function handleAddTask(event) {
    event.preventDefault();

    const trimmedText = taskTextInput.value.trim();

    if (!trimmedText) {
      inputErrorMsg.classList.add('visible');
      taskTextInput.focus();
      return;
    }

    inputErrorMsg.classList.remove('visible');

    const newTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      text: trimmedText,
      priority: taskPrioritySelect.value,
      completed: false,
      createdAt: Date.now(),
      completedAt: null
    };

    tasks.unshift(newTask);
    taskTextInput.value = '';
    taskTextInput.focus();
    render();
  }

  /**
   * Toggle task completion state
   */
  function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    task.completedAt = task.completed ? Date.now() : null;
    render();
  }

  /**
   * Delete single task
   */
  function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    render();
  }

  /**
   * Open modal to edit task
   */
  function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editingTaskId = taskId;
    editTaskInput.value = task.text;

    if (typeof editDialog.showModal === 'function') {
      editDialog.showModal();
    } else {
      // Fallback for older browsers
      const updated = prompt('Edit Task Description:', task.text);
      if (updated !== null && updated.trim()) {
        task.text = updated.trim();
        render();
      }
    }
  }

  /**
   * Save edited task title
   */
  function saveEditedTask(event) {
    event.preventDefault();
    const updated = editTaskInput.value.trim();
    if (!updated) return;

    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
      task.text = updated;
      render();
    }

    editDialog.close();
    editingTaskId = null;
  }

  /**
   * Event Delegation on task lists for checkbox, edit, and delete actions
   */
  function handleListClicks(event) {
    const card = event.target.closest('.task-card');
    if (!card) return;

    const taskId = card.getAttribute('data-id');

    if (event.target.classList.contains('task-checkbox')) {
      toggleTask(taskId);
    } else if (event.target.classList.contains('btn-edit')) {
      openEditModal(taskId);
    } else if (event.target.classList.contains('btn-delete')) {
      deleteTask(taskId);
    }
  }

  // Event Listeners
  form.addEventListener('submit', handleAddTask);
  taskTextInput.addEventListener('input', () => inputErrorMsg.classList.remove('visible'));

  pendingTaskList.addEventListener('click', handleListClicks);
  completedTaskList.addEventListener('click', handleListClicks);

  // Search input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    render();
  });

  // Clear completed button
  clearCompletedBtn.addEventListener('click', () => {
    if (tasks.some(t => t.completed)) {
      if (confirm('Are you sure you want to clear all completed tasks?')) {
        tasks = tasks.filter(t => !t.completed);
        render();
      }
    }
  });

  // Modal actions
  editForm.addEventListener('submit', saveEditedTask);
  cancelEditBtn.addEventListener('click', () => {
    editDialog.close();
    editingTaskId = null;
  });

  // Display current date nicely in header
  if (currentDateDisplay) {
    currentDateDisplay.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  }

  // Initialize
  tasks = loadTasksFromStorage();
  render();
})();
