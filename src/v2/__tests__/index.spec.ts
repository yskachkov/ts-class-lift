import {Lift} from '../index';

jest.useFakeTimers();

describe('Lift', () => {
  const dummySourceFloor = 1;

  beforeEach(() => jest.resetAllMocks());

  it('can create a new lift instance', () => {
    const testLift = new Lift();

    expect(testLift).toBeDefined();
  });

  it('stores floor, doorStatus and direction fields in state', () => {
    const testLift = new Lift();

    expect(testLift.state).toEqual({
      floor: 1,
      status: 'closed',
      direction: 'idle'
    });
  });

  it('can be called with a source floor', () => {
    const dummyPassengerSourceFloor = 5;
    const testLift = new Lift(dummySourceFloor);
    const callSpy = jest.spyOn(testLift, 'call');

    testLift.call(dummyPassengerSourceFloor);

    expect(testLift.state.floor).toBe(dummySourceFloor);
    expect(callSpy).toHaveBeenCalledWith(dummyPassengerSourceFloor);
  });

  describe('moves and', () => {
    it('opens/closes doors if its already on the target floor', () => {
      const testLift = new Lift(dummySourceFloor);

      testLift.call(dummySourceFloor);

      expect(testLift.state).toEqual({
        floor: 1,
        status: 'open',
        direction: 'idle'
      });

      jest.advanceTimersByTime(1500);

      expect(testLift.state).toEqual({
        floor: 1,
        status: 'closed',
        direction: 'idle'
      });
    });

    it('plays sounds on door opening/closing', () => {
      const testLift = new Lift(dummySourceFloor);
      const consoleLogSpy = jest.spyOn(console, 'log');

      testLift.call(dummySourceFloor);

      jest.advanceTimersByTime(1500);

      expect(testLift.state).toEqual({
        floor: 1,
        status: 'closed',
        direction: 'idle'
      });
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'Ding! Doors opening');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'Ding! Doors closing');
    });
  });

  it('ignores move and does not operate doors if no calls were done', () => {
    const testLift = new Lift();
    const consoleLogSpy = jest.spyOn(console, 'log');

    expect(testLift.state).toEqual({
      floor: 1,
      status: 'closed',
      direction: 'idle'
    });

    testLift.move();

    expect(testLift.state).toEqual({
      floor: 1,
      status: 'closed',
      direction: 'idle'
    });
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  describe('delivers passengers to requested floors', () => {
    describe('going down', () => {
      const dummySourceFloor = 5;

      it('for a single call', () => {
        const testLift = new Lift(dummySourceFloor);

        expect(testLift.state).toEqual({
          floor: dummySourceFloor,
          status: 'closed',
          direction: 'idle'
        });

        testLift.call(1);
        testLift.move();

        expect(testLift.state).toEqual({
          floor: dummySourceFloor - 1,
          status: 'closed',
          direction: 'down'
        });

        testLift.move();
        testLift.move();
        testLift.move();

        expect(testLift.state).toEqual({
          floor: 1,
          status: 'open',
          direction: 'down'
        });

        jest.advanceTimersByTime(1500);

        expect(testLift.state).toEqual({
          floor: 1,
          status: 'closed',
          direction: 'idle'
        });
      });

      it('for multiple calls', () => {
        const testLift = new Lift(dummySourceFloor);

        expect(testLift.state).toEqual({
          floor: dummySourceFloor,
          status: 'closed',
          direction: 'idle'
        });

        testLift.call(4);
        testLift.call(2);

        testLift.move();

        expect(testLift.state).toEqual({
          floor: 4,
          status: 'open',
          direction: 'down'
        });

        jest.advanceTimersByTime(1500);

        expect(testLift.state).toEqual({
          floor: 4,
          status: 'closed',
          direction: 'down'
        });

        testLift.move();
        testLift.move();

        expect(testLift.state).toEqual({
          floor: 2,
          status: 'open',
          direction: 'down'
        });

        jest.advanceTimersByTime(1500);

        expect(testLift.state).toEqual({
          floor: 2,
          status: 'closed',
          direction: 'idle'
        });
      });
    });

    describe('going up', () => {
      const dummySourceFloor = 5;

      it('for a single call', () => {
        const testLift = new Lift(dummySourceFloor);

        expect(testLift.state).toEqual({
          floor: dummySourceFloor,
          status: 'closed',
          direction: 'idle'
        });

        testLift.call(10);
        testLift.move();

        expect(testLift.state).toEqual({
          floor: 6,
          status: 'closed',
          direction: 'up'
        });

        testLift.move();
        testLift.move();
        testLift.move();
        testLift.move();

        expect(testLift.state).toEqual({
          floor: 10,
          status: 'open',
          direction: 'up'
        });

        jest.advanceTimersByTime(1500);

        expect(testLift.state).toEqual({
          floor: 10,
          status: 'closed',
          direction: 'idle'
        });
      });

      it('for multiple calls', () => {
        const testLift = new Lift(dummySourceFloor);

        expect(testLift.state).toEqual({
          floor: dummySourceFloor,
          status: 'closed',
          direction: 'idle'
        });

        testLift.call(7);
        testLift.call(9);

        testLift.move();
        testLift.move();

        expect(testLift.state).toEqual({
          floor: 7,
          status: 'open',
          direction: 'up'
        });

        jest.advanceTimersByTime(1500);

        expect(testLift.state).toEqual({
          floor: 7,
          status: 'closed',
          direction: 'up'
        });

        testLift.move();
        testLift.move();

        expect(testLift.state).toEqual({
          floor: 9,
          status: 'open',
          direction: 'up'
        });

        jest.advanceTimersByTime(1500);

        expect(testLift.state).toEqual({
          floor: 9,
          status: 'closed',
          direction: 'idle'
        });
      });
    });
  });
});
