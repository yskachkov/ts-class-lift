export enum Direction {
  Up = 'up',
  Down = 'down'
}

export class Lift {
  private floor: number = 1;
  private direction: Direction = Direction.Up;
  private isDoorsOpen: boolean = true;

  constructor(floor: number) {
    this.floor = floor;
  }

  call(direction: Direction) {
    this.direction = direction;
  }

  playSound(): void {
    console.log('DING');
  }

  open(): void {
    this.playSound();
    this.isDoorsOpen = true;
  }

  close(): void {
    this.playSound();
    this.isDoorsOpen = false;
  }

  go(targetFloor: number): void {
    this.floor = targetFloor;
  }

  get currentFloor(): number {
    return this.floor;
  }

  get doorsOpen(): boolean {
    return this.isDoorsOpen;
  }
}
