import type Action from './Action';

type Operation = {
  action: Action;
  startInOld: number;
  endInOld: number;
  startInNew: number;
  endInNew: number;
};

export default Operation;
