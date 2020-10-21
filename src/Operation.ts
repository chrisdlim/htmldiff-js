export default class Operation {
  action: number;
  startInOld: number;
  endInOld: number;
  startInNew: number;
  endInNew: number;

  constructor(
    action: number,
    startInOld: number,
    endInOld: number,
    startInNew: number,
    endInNew: number
  ) {
    this.action = action;
    this.startInOld = startInOld;
    this.endInOld = endInOld;
    this.startInNew = startInNew;
    this.endInNew = endInNew;
  }
}
