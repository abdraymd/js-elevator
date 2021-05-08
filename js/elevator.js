(function () {
  const floorHeight = 100;
  const elevatorTransition = 500;
  const elevatorDoorsTransition = 200;

  function createElevator() {
    const elevator = document.createElement("div");
    const leftDoor = document.createElement("div");
    const rightDoor = document.createElement("div");

    elevator.classList.add("elevator");
    elevator.style.transitionDuration = `${elevatorTransition}ms`;
    elevator.dataset.floor = 0;
    leftDoor.classList.add("elevator__door", "elevator__door_left");
    leftDoor.style.transitionDuration = `${elevatorDoorsTransition}ms`;
    rightDoor.classList.add("elevator__door", "elevator__door_right");
    rightDoor.style.transitionDuration = `${elevatorDoorsTransition}ms`;

    elevator.append(leftDoor);
    elevator.append(rightDoor);

    // remove elevator_closed class on transform end
    elevator.addEventListener("transitionend", (e) => {
      if (e.target === elevator) {
        elevator.classList.remove("elevator_closed");
      }
    });

    return elevator;
  }

  function findNearestElevatorFloor(container, order) {
    // select all data-floor attributes of elevators in container
    const elevatorsFloorArr = Array.prototype.slice
      .call(container.querySelectorAll(".elevator"))
      .map((el) => +el.dataset.floor);

    const nearestFloor = elevatorsFloorArr.reduce((prev, curr) => {
      return Math.abs(curr - order) < Math.abs(prev - order) ? curr : prev;
    });

    return nearestFloor;
  }

  function changeElevatorPosition(elevator, floorOrder) {
    return new Promise((resolve) => {
      // resolve if elevator floor is equal to floor order
      if (+elevator.dataset.floor === floorOrder) {
        resolve();
      } else {
        // y = floor height * floor order
        const y = floorHeight * floorOrder;

        elevator.classList.add("elevator_closed");
        elevator.dataset.floor = floorOrder;

        // wait for the doors to close before transform
        setTimeout(() => {
          elevator.style.transform = `translateY(-${y}px)`;
          resolve();
        }, elevatorDoorsTransition);
      }
    });
  }

  function moveElevator(elevatorContainer, firstOrder, secondOrder) {
    const nearestElevatorFloor = findNearestElevatorFloor(
      elevatorContainer,
      firstOrder
    );

    const elevator = elevatorContainer.querySelector(
      `.elevator[data-floor="${nearestElevatorFloor}"]`
    );

    // set delay to 0 if elevator floor is equal to first order
    // else set to time of first move
    const delay =
      +elevator.dataset.floor === firstOrder
        ? 0
        : 2 * elevatorDoorsTransition + elevatorTransition;

    changeElevatorPosition(elevator, firstOrder).then(() => {
      setTimeout(() => {
        changeElevatorPosition(elevator, secondOrder);
      }, delay);
    });
  }

  function createFloor(number) {
    const floor = document.createElement("li");
    const text = document.createElement("span");
    const buttonUp = document.createElement("button");
    const buttonDown = document.createElement("button");

    floor.classList.add("floor");
    floor.style.height = `${floorHeight}px`;
    floor.dataset.order = number;
    text.classList.add("floor__order");
    text.textContent = `Floor: ${number + 1}`;
    buttonUp.classList.add("floor__btn", "btn", "btn-sm", "btn-secondary");
    buttonUp.textContent = "Up";
    buttonDown.classList.add("floor__btn", "btn", "btn-sm", "btn-secondary");
    buttonDown.textContent = "Down";

    floor.append(text);
    floor.append(buttonUp);
    floor.append(buttonDown);

    return {
      floor,
      buttonUp,
      buttonDown,
    };
  }

  function createHeading(text) {
    const heading = document.createElement("div");
    const title = document.createElement("h1");
    const button = document.createElement("button");

    heading.classList.add(
      "d-flex",
      "align-items-center",
      "justify-content-between"
    );
    title.classList.add("mb-3");
    title.textContent = text;
    button.classList.add("btn", "btn-primary");
    button.textContent = "Add floor";

    heading.append(title);
    heading.append(button);

    return {
      heading,
      button,
    };
  }

  function createHouse(elevatorCount) {
    const house = document.createElement("div");
    const floorList = document.createElement("ul");
    const elevatorGroup = document.createElement("div");

    house.classList.add("house");
    floorList.classList.add("house__floor-list");
    elevatorGroup.classList.add("elevator-group");

    for (let i = 0; i < elevatorCount; i++) {
      elevatorGroup.append(createElevator());
    }

    house.append(floorList);
    house.append(elevatorGroup);

    return {
      house,
      floorList,
      elevatorGroup,
    };
  }

  function createElevatorApp(container, title, floorCount, elevatorCount = 1) {
    const heading = createHeading(title);
    const house = createHouse(elevatorCount);

    const addEventToFloorButton = (button, order, direction) => {
      button.addEventListener("click", () => {
        const secondOrder =
          direction === "up" ? house.floorList.children.length - 1 : 0;

        moveElevator(house.elevatorGroup, order, secondOrder);
      });
    };

    heading.button.addEventListener("click", () => {
      const floorListLength = house.floorList.children.length;
      const floor = createFloor(floorListLength);
      addEventToFloorButton(floor.buttonUp, floorListLength, "up");
      addEventToFloorButton(floor.buttonDown, floorListLength, "down");

      house.floorList.prepend(floor.floor);
    });

    for (let i = 0; i < floorCount; i++) {
      const floor = createFloor(i);
      addEventToFloorButton(floor.buttonUp, i, "up");
      addEventToFloorButton(floor.buttonDown, i, "down");

      house.floorList.prepend(floor.floor);
    }

    container.append(heading.heading);
    container.append(house.house);
  }

  window.createElevatorApp = createElevatorApp;
})();
