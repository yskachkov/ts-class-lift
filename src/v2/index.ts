export enum Direction {
  Up = 'up',
  Down = 'down',
  Idle = 'idle'
}

export enum DoorStatus {
  Open = 'open',
  Closed = 'closed'
}

interface LiftStatus {
  floor: number;
  status: DoorStatus;
  direction: Direction;
}

export class Lift {
  private currentFloor: number = 1;
  private direction: Direction = Direction.Idle;
  private status: DoorStatus = DoorStatus.Closed;
  private floorQueue: Set<number> = new Set();

  constructor(sourceFloor?: number) {
    if (sourceFloor) {
      this.currentFloor = sourceFloor;
    }
  }

  get state(): LiftStatus {
    return {
      floor: this.currentFloor,
      status: this.status,
      direction: this.direction
    };
  }

  private playSound(action: string): void {
    console.log(`Ding! ${action}`);
  }

  private openDoors(): void {
    this.playSound('Doors opening');
    this.status = DoorStatus.Open;

    setTimeout(() => this.closeDoors(), 1000);
  }

  private closeDoors(): void {
    this.playSound('Doors closing');
    this.status = DoorStatus.Closed;

    if (this.isFloorQueueEmpty) {
      this.direction = Direction.Idle;
    }
  }

  private getNextTargetFloor(): number {
    const destinationFloors: number[] = Array.from(this.floorQueue);
    const sortedDestinationFloors: number[] = destinationFloors.sort(
      (floorA: number, floorB: number)=> floorA - floorB
    );
    let nextTargetFloor: number | undefined;

    switch (this.direction) {
      case Direction.Up:
        nextTargetFloor = sortedDestinationFloors[0];
        break;
      case Direction.Down:
        nextTargetFloor = sortedDestinationFloors.reverse()[0];
        break;
      case Direction.Idle:
      default:
        nextTargetFloor = destinationFloors[0];
        break;
    }

    return nextTargetFloor ?? destinationFloors[0] ?? this.currentFloor;
  }

  private get isFloorQueueEmpty(): boolean {
    return this.floorQueue.size === 0;
  }

  call(targetFloor: number): void {
    if (this.currentFloor === targetFloor) {
      this.openDoors();
      return;
    }

    if (this.isFloorQueueEmpty) {
      this.direction = targetFloor > this.currentFloor ? Direction.Up : Direction.Down;
    }

    this.floorQueue.add(targetFloor);
  }

  move(): void {
    if (this.isFloorQueueEmpty) {
      this.direction = Direction.Idle;
      return;
    }

    const nextTargetFloor: number = this.getNextTargetFloor();

    if (nextTargetFloor > this.currentFloor) {
      this.direction = Direction.Up;
      this.currentFloor++;
    }

    if (nextTargetFloor < this.currentFloor) {
      this.direction = Direction.Down;
      this.currentFloor--;
    }

    if (this.currentFloor === nextTargetFloor) {
      this.openDoors();
      this.floorQueue.delete(nextTargetFloor);
    }
  }
}
