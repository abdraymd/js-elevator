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

  function findNearestElevatorFloor(floorOrder) {
    const elevatorsFloorArr = Array.prototype.slice
      .call(document.querySelectorAll(".elevator"))
      .map((el) => +el.dataset.floor);

    const nearestFloor = elevatorsFloorArr.reduce((prev, curr) => {
      return Math.abs(curr - floorOrder) < Math.abs(prev - floorOrder)
        ? curr
        : prev;
    });

    return nearestFloor;
  }

  function moveElevator(floorOrder) {
    const nearestElevatorFloor = findNearestElevatorFloor(floorOrder);

    // exit from function if floor order is equal to elevator floor
    if (nearestElevatorFloor === floorOrder) {
      return;
    }

    const elevator = document.querySelector(
      `.elevator[data-floor="${findNearestElevatorFloor(floorOrder)}"]`
    );

    const floor = document.querySelector(
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
    const floorButton = document.createElement("button");

    floor.classList.add("house__floor");
    floor.dataset.order = number;
    floorButton.classList.add(
      "house__floor-btn",
      "btn",
      "btn-sm",
      "btn-secondary"
    );
    floorButton.textContent = number + 1;

    floorButton.addEventListener("click", () => {
      moveElevator(number);
    });
    floor.append(floorButton);

    return floor;
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

    button.addEventListener("click", () => {
      const houseFloorList = document.querySelector(".house ul");
      houseFloorList.prepend(createFloor(houseFloorList.children.length));
    });

    heading.append(title);
    heading.append(button);

    return heading;
  }

  function createHouse(floorCount, elevatorCount = 1) {
    const house = document.createElement("div");
    const floorList = document.createElement("ul");
    const elevatorGroup = document.createElement("div");

    house.classList.add("house");
    elevatorGroup.classList.add("elevator-group");

    for (let i = 0; i < floorCount; i++) {
      floorList.prepend(createFloor(i));
    }

    for (let i = 0; i < elevatorCount; i++) {
      elevatorGroup.append(createElevator());
    }

    house.append(floorList);
    house.append(elevatorGroup);

    return house;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("elevator-app");
    const heading = createHeading("Elevator");
    const house = createHouse(5, 2);

    container.append(heading);
    container.append(house);
  });
})();
