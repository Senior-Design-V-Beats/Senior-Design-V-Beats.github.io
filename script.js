const scheduleStorageKey = "vbeats-phase1-gantt-v1";
const timelineUnitDays = 7;
const timelineUnitWidth = 48;
const ganttRowHeight = 48;

const phaseOne = {
    id: "1",
    name: "Phase 1: V-Beats",
    start: "2026-09-02",
    finish: "2026-09-29",
    progress: 0,
    children: [
        {
            id: "2",
            name: "Project Statement",
            start: "2026-09-17",
            finish: "2026-09-23",
            progress: 0,
            children: [
                { id: "3", name: "Motivation", start: "2026-09-17", finish: "2026-09-18", predecessor: "20SS", progress: 0 },
                { id: "4", name: "Goals / Objectives", start: "2026-09-17", finish: "2026-09-18", predecessor: "3SS", progress: 0 },
                { id: "5", name: "Major Issues", start: "2026-09-21", finish: "2026-09-21", predecessor: "4", progress: 0 },
                { id: "6", name: "Create Mission Statement", start: "2026-09-22", finish: "2026-09-23", predecessor: "5", progress: 0 }
            ]
        },
        {
            id: "7",
            name: "Literature Review",
            start: "2026-09-02",
            finish: "2026-09-27",
            progress: 0,
            children: [
                { id: "8", name: "State of the Art Technology", start: "2026-09-02", finish: "2026-09-20", progress: 0 },
                { id: "9", name: "Commercial Applications", start: "2026-09-02", finish: "2026-09-20", predecessor: "8SS", progress: 0 }
            ]
        },
        {
            id: "10",
            name: "Needs & Specifications",
            start: "2026-09-08",
            finish: "2026-09-10",
            progress: 0,
            children: [
                { id: "11", name: "Societal / Market Needs", start: "2026-09-08", finish: "2026-09-08", progress: 0 },
                { id: "12", name: "Customer Needs", start: "2026-09-08", finish: "2026-09-08", predecessor: "11SS", progress: 0 },
                { id: "13", name: "Review of Stakeholders", start: "2026-09-08", finish: "2026-09-09", predecessor: "11SS", progress: 0 },
                { id: "14", name: "Review of Needs", start: "2026-09-08", finish: "2026-09-09", predecessor: "11SS", progress: 0 },
                { id: "15", name: "Customer Voice Table", start: "2026-09-10", finish: "2026-09-10", predecessor: "14", progress: 0 }
            ]
        },
        {
            id: "16",
            name: "Concept Generation / Selection",
            start: "2026-09-11",
            finish: "2026-09-18",
            progress: 0,
            children: [
                { id: "17", name: "Generated / Drawn", start: "2026-09-11", finish: "2026-09-15", predecessor: "15", progress: 0 },
                { id: "18", name: "Compared Using Metrics", start: "2026-09-16", finish: "2026-09-16", predecessor: "17", progress: 0 },
                { id: "19", name: "Concept Refinement", start: "2026-09-17", finish: "2026-09-17", predecessor: "18", progress: 0 },
                { id: "20", name: "Combined / Selected", start: "2026-09-18", finish: "2026-09-18", predecessor: "19", progress: 0 }
            ]
        },
        {
            id: "21",
            name: "Technical Analysis",
            start: "2026-09-21",
            finish: "2026-09-21",
            progress: 0,
            children: [
                { id: "22", name: "Discuss areas for phase 2", start: "2026-09-21", finish: "2026-09-21", predecessor: "20", progress: 0 },
                { id: "23", name: "Cite research on how others have modelled", start: "2026-09-21", finish: "2026-09-21", predecessor: "22SS", progress: 0 }
            ]
        },
        {
            id: "24",
            name: "Project Plan",
            start: "2026-09-22",
            finish: "2026-09-23",
            progress: 0,
            children: [
                { id: "25", name: "Deliverables", start: "2026-09-22", finish: "2026-09-22", predecessor: "23", progress: 0 },
                { id: "26", name: "Gantt Chart", start: "2026-09-22", finish: "2026-09-23", predecessor: "25SS", progress: 0 },
                { id: "27", name: "Budget", start: "2026-09-22", finish: "2026-09-22", predecessor: "25SS", progress: 0 }
            ]
        },
        { id: "28", name: "Team Meetings", start: "2026-09-10", finish: "2026-09-24", progress: 0 },
        { id: "29", name: "Advisor Meetings", start: "2026-09-01", finish: "2026-09-15", progress: 0 },
        { id: "30", name: "Phase 1 Report Advisor Review", start: "2026-09-24", finish: "2026-09-24", predecessor: "27", progress: 0, milestone: true },
        { id: "31", name: "Phase 1 Report Due", start: "2026-09-25", finish: "2026-09-25", predecessor: "30", progress: 0, milestone: true },
        { id: "32", name: "Phase 1 Presentation", start: "2026-09-29", finish: "2026-09-29", predecessor: "31", progress: 0, milestone: true }
    ]
};

const ganttChart = document.getElementById("gantt-chart");
const collapsedTaskGroups = new Set();
const visibleRowPositions = new Map();
const allScheduleTasks = [];

function collectTasks(task, parentId = null, depth = 0) {
    allScheduleTasks.push({ task, parentId, depth });
    (task.children || []).forEach((child) => collectTasks(child, task.id, depth + 1));
}

collectTasks(phaseOne);

function getTask(taskId) {
    return allScheduleTasks.find(({ task }) => task.id === taskId)?.task;
}

function utcDay(date) {
    const [year, month, day] = date.split("-").map(Number);
    return Date.UTC(year, month - 1, day) / 86400000;
}

function asDate(day) {
    return new Date(day * 86400000).toISOString().slice(0, 10);
}

function dayOffset(date, rangeStart) {
    return utcDay(date) - utcDay(rangeStart);
}

function formatShortDate(date) {
    const [, month, day] = date.split("-").map(Number);
    return `${month}/${day}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function visibleTimeline() {
    const dates = allScheduleTasks
        .filter(({ task }) => !task.children?.length)
        .flatMap(({ task }) => [task.start, task.finish])
        .map(utcDay);
    const firstDay = Math.min(utcDay("2026-09-01"), ...dates);
    const lastDay = Math.max(utcDay("2026-09-29"), ...dates);
    const startDay = firstDay - ((firstDay - utcDay("2026-09-01")) % timelineUnitDays + timelineUnitDays) % timelineUnitDays;
    const endDay = Math.ceil((lastDay - startDay + 1) / timelineUnitDays) * timelineUnitDays;
    return { start: asDate(startDay), days: endDay, weeks: endDay / timelineUnitDays };
}

function saveSchedule() {
    try {
        localStorage.setItem(scheduleStorageKey, JSON.stringify({
            tasks: allScheduleTasks.map(({ task }) => ({
                id: task.id,
                start: task.start,
                finish: task.finish,
                predecessor: task.predecessor || "",
                progress: task.progress
            })),
            collapsed: [...collapsedTaskGroups]
        }));
        const status = document.querySelector(".schedule-note");
        status.dataset.saved = "true";
    } catch (error) {
        console.error("Could not save the Phase 1 schedule.", error);
        const status = document.querySelector(".schedule-note");
        status.textContent = "The schedule could not be saved in this browser. Changes remain visible until the page is refreshed.";
        status.setAttribute("role", "status");
    }
}

function loadSchedule() {
    try {
        const saved = localStorage.getItem(scheduleStorageKey);
        if (!saved) return;
        const parsed = JSON.parse(saved);
        const savedTasks = new Map((parsed.tasks || []).map((task) => [task.id, task]));
        allScheduleTasks.forEach(({ task }) => {
            const savedTask = savedTasks.get(task.id);
            if (!savedTask) return;
            if (/^\d{4}-\d{2}-\d{2}$/.test(savedTask.start || "")) task.start = savedTask.start;
            if (/^\d{4}-\d{2}-\d{2}$/.test(savedTask.finish || "")) task.finish = savedTask.finish;
            if (typeof savedTask.predecessor === "string") task.predecessor = savedTask.predecessor;
            if (Number.isInteger(savedTask.progress)) task.progress = Math.max(0, Math.min(100, savedTask.progress));
        });
        (parsed.collapsed || []).forEach((id) => {
            if (allScheduleTasks.some(({ task }) => task.id === id && task.children?.length)) collapsedTaskGroups.add(id);
        });
    } catch (error) {
        console.error("Could not load the saved Phase 1 schedule.", error);
        const status = document.querySelector(".schedule-note");
        status.textContent = "The saved schedule could not be read. Showing the original Phase 1 dates.";
        status.setAttribute("role", "status");
    }
}

function dependencyTokens(value) {
    return value.split(/[;,]/).map((token) => {
        const match = token.trim().match(/^(\d+)\s*(SS|FS)?$/i);
        return match ? { id: match[1], type: (match[2] || "FS").toUpperCase() } : null;
    }).filter(Boolean);
}

function dependencyIsValid(predecessor, successor, type) {
    const predecessorDate = type === "SS" ? predecessor.start : predecessor.finish;
    return utcDay(predecessorDate) <= utcDay(successor.start);
}

function renderHeader(timeline) {
    const weeks = Array.from({ length: timeline.weeks }, (_, index) => {
        const weekDate = asDate(utcDay(timeline.start) + index * timelineUnitDays);
        return `<div class="gantt-week">W${index + 1}<small>${formatShortDate(weekDate)}</small></div>`;
    }).join("");
    return `
        <div class="gantt-header">
            <div class="gantt-header-label">
                <span>Task name</span><span>Start</span><span>Finish</span><span>Predecessors</span><span>Done</span>
            </div>
            <div class="gantt-header-timeline" style="--timeline-width:${timeline.weeks * timelineUnitWidth}px">
                <div class="gantt-month-label">September 2026 · weekly timeline</div>
                <div class="gantt-weeks">${weeks}</div>
            </div>
        </div>`;
}

function renderTaskRow(task, depth, rowIndex, timeline) {
    const { start, finish } = task;
    const isGroup = Boolean(task.children?.length);
    const isCollapsed = collapsedTaskGroups.has(task.id);
    const left = dayOffset(start, timeline.start);
    const days = dayOffset(finish, start) + 1;
    const isMilestone = Boolean(task.milestone);
    const taskName = escapeHtml(task.name);
    const classes = ["gantt-row"];
    if (isGroup) classes.push("gantt-group");
    if (isMilestone) classes.push("gantt-milestone-row");
    const progress = Number.isInteger(task.progress) ? task.progress : 0;
    const predecessors = task.predecessor || "";
    const hasInvalidPredecessor = dependencyTokens(predecessors).some(({ id, type }) => {
        const predecessor = getTask(id);
        return predecessor && !dependencyIsValid(predecessor, task, type);
    });
    const marker = isMilestone
        ? `<span class="gantt-milestone-marker" style="left:calc(${left + days / 2} * var(--day-width))" title="${taskName}"></span>`
        : `<div class="gantt-bar ${isGroup ? "gantt-group-bar" : ""}" style="left:calc(${left} * var(--day-width));width:calc(${days} * var(--day-width))" title="${taskName} · ${progress}% complete">
                <div class="gantt-bar-progress" style="width:${progress}%"></div>
            </div>`;
    const button = isGroup
        ? `<button class="gantt-toggle" type="button" data-toggle-task="${task.id}" aria-expanded="${!isCollapsed}" aria-label="${isCollapsed ? "Expand" : "Collapse"} ${taskName}">${isCollapsed ? "▶" : "▼"}</button>`
        : `<span class="gantt-task-bullet" aria-hidden="true">${isMilestone ? "◆" : "•"}</span>`;
    const editable = isGroup ? "" : `
        <input type="date" value="${task.start}" data-field="start" aria-label="${taskName} start date">
        <input type="date" value="${task.finish}" data-field="finish" aria-label="${taskName} finish date">
        <input class="gantt-predecessor-input ${hasInvalidPredecessor ? "has-invalid-predecessor" : ""}" type="text" value="${escapeHtml(predecessors)}" data-field="predecessor" aria-label="${taskName} predecessors" title="${hasInvalidPredecessor ? "Predecessor date appears later than this task start." : "Use task number and optional SS or FS, e.g. 3SS"}">
        <input class="gantt-progress-input" type="number" min="0" max="100" step="5" value="${progress}" data-field="progress" aria-label="${taskName} percent complete">`;
    const summary = isGroup ? `<span class="gantt-group-summary">${task.children.length} subtasks</span>` : "";

    return `
        <div class="${classes.join(" ")}" data-task-id="${task.id}" data-row-index="${rowIndex}">
            <div class="gantt-label">
                <div class="gantt-task-name ${isGroup ? "gantt-group-title" : ""}" style="--task-depth:${depth}">
                    ${button}<span class="gantt-name-text">${taskName}</span>${summary}
                </div>
                ${isGroup
                    ? `<span class="gantt-meta-value">${formatShortDate(start)}</span><span class="gantt-meta-value">${formatShortDate(finish)}</span><span class="gantt-meta-value">—</span><span class="gantt-meta-value">${progress}%</span>`
                    : editable}
            </div>
            <div class="gantt-timeline-row" style="--timeline-width:${timeline.weeks * timelineUnitWidth}px;--day-width:${timelineUnitWidth / timelineUnitDays}px">
                ${marker}
            </div>
        </div>`;
}

function renderDependencies(rowPositions, timeline) {
    const paths = [];
    allScheduleTasks.forEach(({ task }) => {
        if (collapsedTaskGroups.size && !rowPositions.has(task.id)) return;
        dependencyTokens(task.predecessor || "").forEach(({ id, type }) => {
            const predecessor = getTask(id);
            const sourceY = rowPositions.get(id);
            const targetY = rowPositions.get(task.id);
            if (!predecessor || sourceY === undefined || targetY === undefined) return;
            if (!dependencyIsValid(predecessor, task, type)) return;
            const sourceDate = type === "SS" ? predecessor.start : predecessor.finish;
            const sourceX = dayOffset(sourceDate, timeline.start) * (timelineUnitWidth / timelineUnitDays);
            const targetX = dayOffset(task.start, timeline.start) * (timelineUnitWidth / timelineUnitDays);
            const bendX = Math.max(sourceX + 5, Math.min(targetX - 5, sourceX + 14));
            paths.push(`<path d="M ${sourceX} ${sourceY} H ${bendX} V ${targetY} H ${targetX}" marker-end="url(#gantt-arrow)" />`);
        });
    });
    return `
        <svg class="gantt-dependencies" width="${timeline.weeks * timelineUnitWidth}" height="${rowPositions.size * ganttRowHeight}" aria-hidden="true">
            <defs><marker id="gantt-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#8496aa"></path></marker></defs>
            ${paths.join("")}
        </svg>`;
}

function renderRows(task, depth, timeline, rowIndexRef) {
    const currentIndex = rowIndexRef.value;
    rowIndexRef.value += 1;
    if (!task.children?.length) {
        visibleRowPositions.set(task.id, currentIndex * ganttRowHeight + ganttRowHeight / 2);
    }
    const rendered = [renderTaskRow(task, depth, currentIndex, timeline)];
    if (task.children?.length && !collapsedTaskGroups.has(task.id)) {
        task.children.forEach((child) => rendered.push(...renderRows(child, depth + 1, timeline, rowIndexRef)));
    }
    return rendered;
}

function renderGantt() {
    const timeline = visibleTimeline();
    visibleRowPositions.clear();
    const rowIndexRef = { value: 0 };
    const rows = renderRows(phaseOne, 0, timeline, rowIndexRef);
    const chartWidth = timeline.weeks * timelineUnitWidth;
    ganttChart.innerHTML = `
        <div class="gantt-grid" style="--timeline-width:${chartWidth}px">
            ${renderHeader(timeline)}
            <div class="gantt-board">
                ${rows.join("")}
                ${renderDependencies(visibleRowPositions, timeline)}
            </div>
        </div>`;
}

ganttChart.addEventListener("click", (event) => {
    const button = event.target.closest("[data-toggle-task]");
    if (!button) return;
    const taskId = button.dataset.toggleTask;
    if (collapsedTaskGroups.has(taskId)) collapsedTaskGroups.delete(taskId);
    else collapsedTaskGroups.add(taskId);
    saveSchedule();
    renderGantt();
});

ganttChart.addEventListener("change", (event) => {
    const input = event.target.closest("input[data-field]");
    if (!input) return;
    const row = input.closest("[data-task-id]");
    const task = getTask(row.dataset.taskId);
    if (!task) return;

    if (input.dataset.field === "start" || input.dataset.field === "finish") {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(input.value)) return;
        task[input.dataset.field] = input.value;
        if (task.start > task.finish) {
            if (input.dataset.field === "start") task.finish = task.start;
            else task.start = task.finish;
        }
    } else if (input.dataset.field === "predecessor") {
        task.predecessor = input.value.trim();
    } else if (input.dataset.field === "progress") {
        const progress = Number(input.value);
        if (!Number.isFinite(progress)) return;
        task.progress = Math.max(0, Math.min(100, Math.round(progress)));
    }

    saveSchedule();
    renderGantt();
});

loadSchedule();
renderGantt();