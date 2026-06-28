const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const progress = document.getElementById("progress");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

// Load tasks when page opens
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

displayTasks();

// Add Task
addTaskBtn.addEventListener("click", function () {

    const task = taskInput.value.trim();
    const deadline = deadlineInput.value;
    const category = categoryInput.value;
    const priority = priorityInput.value;

    if (task === "") {
        alert("Please enter a task.");
        return;
    }

    let warning = "";

    if (deadline !== "") {

        const today = new Date();
        const due = new Date(deadline);

        const diff =
            (due - today) /
            (1000 * 60 * 60 * 24);

        if (diff <= 2 && diff >= 0) {
            warning = " ⚠ Due Soon";
        }
    }

    tasks.push({
        task,
        category,
        priority,
        deadline,
        warning,
        completed: false
    });

    saveTasks();

    displayTasks();

    taskInput.value = "";
    deadlineInput.value = "";

});

// Save
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display
function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach((item, index) => {

        const li = document.createElement("li");

        if (item.completed) {
            li.classList.add("completed");
            li.style.textDecoration = "line-through";
        }

        li.innerHTML =

            item.task +
            " | Category: " + item.category +
            " | Priority: " + item.priority +
            " | Deadline: " + item.deadline +
            item.warning;

        const doneBtn =
            document.createElement("button");

        doneBtn.textContent = "Done";

        doneBtn.onclick = function () {

            tasks[index].completed =
                !tasks[index].completed;

            saveTasks();

            displayTasks();

        };

        const deleteBtn =
            document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.onclick = function () {

            tasks.splice(index, 1);

            saveTasks();

            displayTasks();

        };

        li.appendChild(doneBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });

    updateProgress();

}

// Progress
function updateProgress() {

    totalTasks.textContent = tasks.length;

    const completed =
        tasks.filter(t => t.completed).length;

    completedTasks.textContent = completed;

    const percent =
        tasks.length === 0
            ? 0
            : Math.round((completed / tasks.length) * 100);

    progress.textContent = percent + "%";

}
// -------------------- DARK MODE --------------------

const darkModeBtn = document.getElementById("darkModeBtn");

if (localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark-mode");
}

darkModeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "on");
    } else {
        localStorage.removeItem("darkMode");
    }

});

// -------------------- SEARCH --------------------

const searchTask = document.getElementById("searchTask");

searchTask.addEventListener("keyup", function () {

    const filter = searchTask.value.toLowerCase();

    const li = taskList.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {

        if (li[i].textContent.toLowerCase().includes(filter)) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }

    }

});

// -------------------- EXPORT TASKS --------------------

const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", function () {

    let content = "SMARTSTUDY AI TASK REPORT\n\n";

    tasks.forEach(function (task) {

        content +=
            "Task: " + task.task +
            "\nCategory: " + task.category +
            "\nPriority: " + task.priority +
            "\nDeadline: " + task.deadline +
            "\nCompleted: " + (task.completed ? "Yes" : "No") +
            "\n-------------------------\n";

    });

    const blob = new Blob([content], { type: "text/plain" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "SmartStudyTasks.txt";

    link.click();

});

// -------------------- MOTIVATION --------------------

const quoteBtn = document.getElementById("quoteBtn");
const quoteText = document.getElementById("quoteText");

const quotes = [

    "Success is the sum of small efforts repeated daily.",

    "Believe in yourself and all that you are.",

    "Dream big. Start small. Act now.",

    "Never stop learning.",

    "Your future is created by what you do today."

];

quoteBtn.addEventListener("click", function () {

    const random =
        Math.floor(Math.random() * quotes.length);

    quoteText.textContent =
        quotes[random];

});

// -------------------- STUDY PLAN --------------------

const planBtn = document.getElementById("planBtn");

const subjectInput = document.getElementById("subject");

const daysInput = document.getElementById("days");

const studyPlan = document.getElementById("studyPlan");

// Load saved plan
const savedPlan = localStorage.getItem("studyPlan");

if (savedPlan) {
    studyPlan.innerHTML = savedPlan;
}

planBtn.addEventListener("click", function () {

    const subject = subjectInput.value.trim();

    const days = parseInt(daysInput.value);

    if (subject === "" || isNaN(days) || days <= 0) {

        alert("Please enter subject and number of days.");

        return;

    }

    let plan = "<h3>Your Study Plan</h3>";

    for (let i = 1; i <= days; i++) {

        plan +=
            "<p><b>Day " + i + ":</b> Study " +
            subject +
            " for 2 hours and revise for 30 minutes.</p>";

    }

    studyPlan.innerHTML = plan;

    localStorage.setItem("studyPlan", plan);

});