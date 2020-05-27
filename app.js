$(function () {

    // UI FUNCTION

    var view = (() => {
        const DOMElements = {
            taskInput: $("#task-input"),
            addBtn: $("#add-btn"),
            taskList: $("#tasksList"),
            completedTaskList: $("#completed-task__list"),
            checkboxID: 1,
        };

        const animations = {
            fadeInUp: "animate__animated animate__fadeInUp",
            fadeOutDown: "animate__animated animate__fadeOutDown"
        };

        // Drag and drop between 2 containers using Jquery ui sortable widget
        $("#tasksList, #completed-task__list").sortable({
            helper: "clone",
            opacity: 0.5,
            cursor: "crosshair",
            connectWith: '.list',
            receive: function (event, ui) {
                // if element in completed task container - checkbox should be checked and vice versa
                if (event.target.id == "completed-task__list") {
                    ui.item.children()[0].children[0].checked = true;
                } else if (event.target.id == "tasksList") {
                    ui.item.children()[0].children[0].checked = false;
                }
            }
        });

        $("#tasksList, #completed-task__list").disableSelection();

        return {
            getInput: function () {
                return {
                    // return the input value
                    inputValue: DOMElements.taskInput.val(),
                };
            },

            // add new task function
            addItem: function (obj) {
                var html, newHtml;

                html = `<a href="#" class="list-group-item list-group-item-action" id="task">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="customCheck${DOMElements.checkboxID}">
                        <label class="custom-control-label" for="customCheck${DOMElements.checkboxID}"></label>
                    </div>
                    %task%
                    <div id="delete-btn__container" class="delete-btn__container">
                    <button type="button" class="btn" id="delete-btn">
                    </button>
                    <ion-icon name="trash-outline" id="delete-icon" class="delete-icon"></ion-icon>
                    </div>
                </a>`;

                // add input value
                newHtml = html.replace(`%task%`, obj);
                // generate unique number for checkbox
                DOMElements.checkboxID++;
                // append html to taskList container with some animation
                DOMElements.taskList.append($(newHtml).hide().fadeIn(500));
                // after adding the task input should be empty
                DOMElements.taskInput.val("");
            },

            // when task is checked move task to the completed tasks list
            completeTask: function (obj) {
                var html = obj[0];

                // add animation
                $(html).addClass(animations.fadeOutDown);
                setTimeout(function () {
                    DOMElements.completedTaskList.append($(html).removeClass(animations.fadeOutDown).addClass(animations.fadeInUp));
                }, 800);
            },

            // when task is unchecked move task to be done list
            uncheckTask: function (obj) {
                var html = obj[0];
                DOMElements.taskList.append($(html));
            },

            // delete task with animation
            deleteItem: function (obj) {
                obj.fadeOut(500, function () {
                    $(this).remove();
                })
            },

            // send dom elements to global scope
            getDomElements: function () {
                return DOMElements;
            }
        };
    })();

    // CONTROLLER FUNCTION

    var controller = ((view) => {
        // all event listeners
        var setupEventListeners = function () {
            // get dom elements
            var el = view.getDomElements();
            // click listeners
            $(el.addBtn).click(ctrlAddItem);
            el.taskList.add(el.completedTaskList).on('click', ctrlDeleteItem);
            el.taskList.add(el.completedTaskList).on('click', ctrlCompleteTask);
        };

        var ctrlAddItem = function (e) {
            var input = view.getInput();
            if (input.inputValue == "" || input.inputValue == " ") {
                alert("You should type something");
                return;
            } else {
                view.addItem(input.inputValue);
            }
        };

        var ctrlCompleteTask = function (e) {
            if ($(e.target).hasClass("custom-control-input")) {
                var completedTask = $(e.target).parent().parent();
                if (e.target.checked) {
                    view.completeTask(completedTask);
                } else if (!e.target.checked) {
                    view.uncheckTask(completedTask);
                }
            }
        };

        var ctrlDeleteItem = function (e) {
            var deleteTask;
            var itemID = e.target.id;


            if (itemID == "delete-btn__container") {
                deleteTask = $(e.target).parent();
                view.deleteItem(deleteTask);
            } else if (itemID == "delete-icon") {
                deleteTask = $(e.target).parent().parent();
                view.deleteItem(deleteTask);
            }

        };

        return {
            init: function () {
                setupEventListeners();
            },
        };
    })(view);

    controller.init();
});