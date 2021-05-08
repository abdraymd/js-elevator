(function () {
  function createElevator() {
    const elevator = document.createElement("div");
    elevator.classList.add("elevator");
    elevator.dataset.floor = 0;

    // remove elevator_closed class on transform end
    elevator.addEventListener("transitionend", () => {
      elevator.classList.toggle("elevator_closed");
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

  function moveElevator(floorContainer, elevatorContainer, floorOrder) {
    const nearestElevatorFloor = findNearestElevatorFloor(
      elevatorContainer,
      floorOrder
    );

    // exit from function if floor order is equal to elevator floor
    if (nearestElevatorFloor === floorOrder) {
      return;
    }

    const elevator = elevatorContainer.querySelector(
      `.elevator[data-floor="${nearestElevatorFloor}"]`
    );

    const floor = floorContainer.querySelector(
      `.house__floor[data-order="${floorOrder}"]`
    );

    // x = floor height * floor order
    const x = floor.offsetHeight * floorOrder;

    elevator.classList.toggle("elevator_closed");
    elevator.dataset.floor = floorOrder;

    // wait for the doors to close before transform
    setTimeout(() => {
      elevator.style.transform = `translateY(-${x}px)`;
    }, 200);
  }

  function createFloor(number) {
    const floor = document.createElement("li");
    const button = document.createElement("button");

    floor.classList.add("house__floor");
    floor.dataset.order = number;
    button.classList.add("house__floor-btn", "btn", "btn-sm", "btn-secondary");
    button.textContent = number + 1;

    floor.append(button);

    return {
      floor,
      button,
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
    button.textContent = "Добавить этаж";

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

    const addEventToFloorButton = (button, order) => {
      button.addEventListener("click", () => {
        moveElevator(house.floorList, house.elevatorGroup, order);
      });
    };

    heading.button.addEventListener("click", () => {
      const lastFloorOrder = house.floorList.children.length;
      const floor = createFloor(lastFloorOrder);
      addEventToFloorButton(floor.button, lastFloorOrder);

      house.floorList.prepend(floor.floor);
    });

    for (let i = 0; i < floorCount; i++) {
      const floor = createFloor(i);
      addEventToFloorButton(floor.button, i);

      house.floorList.prepend(floor.floor);
    }

    container.append(heading.heading);
    container.append(house.house);
  }

  window.createElevatorApp = createElevatorApp;
})();
