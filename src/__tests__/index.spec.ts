import {Lift, Direction} from '../index';

describe('lift', () => {
  const dummyCurrentPosition = 1;
  const dummyDirection = Direction.Up;
  const dummyTargetFloor = 5;

  it('can create a lift instance', () => {
    const testLift = new Lift(dummyCurrentPosition);

    expect(testLift).toBeDefined();
  });

  describe('responds to calls containing a direction', () => {
    it(`${Direction.Up}`, () => {
      const testLift = new Lift(dummyCurrentPosition);
      const spyCall = jest.spyOn(testLift, 'call');

      testLift.call(Direction.Up);

      expect(spyCall).toHaveBeenCalledWith(Direction.Up);
    });

    it(`${Direction.Down}`, () => {
      const testLift = new Lift(dummyCurrentPosition);
      const spyCall = jest.spyOn(testLift, 'call');

      testLift.call(Direction.Down);

      expect(spyCall).toHaveBeenCalledWith(Direction.Down);
    });
  });

  it('has an attribute floor, which describes it’s current location', () => {
    const dummyFloor = 1;
    const testLift = new Lift(dummyCurrentPosition);

    expect(testLift.currentFloor).toBe(dummyFloor);
  });

  it('lift delivers passengers to requested floors', () => {
    const testLift = new Lift(dummyCurrentPosition);

    testLift.call(dummyDirection);
    testLift.go(dummyTargetFloor);

    expect(testLift.currentFloor).toBe(dummyTargetFloor);
  });

  describe('plays sound', () => {
    it('doors opening', () => {
      const testLift = new Lift(dummyCurrentPosition);
      const spyConsoleLog = jest.spyOn(console, 'log');

      testLift.call(dummyDirection);
      testLift.open();

      expect(spyConsoleLog).toHaveBeenCalledWith('DING');
      expect(testLift.doorsOpen).toBe(true);
    });

    it('doors closing', () => {
      const testLift = new Lift(dummyCurrentPosition);
      const spyConsoleLog = jest.spyOn(console, 'log');

      testLift.call(dummyDirection);
      testLift.close();

      expect(spyConsoleLog).toHaveBeenCalledWith('DING');
      expect(testLift.doorsOpen).toBe(false);
    });
  });
});
