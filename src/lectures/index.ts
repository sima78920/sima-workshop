import type { Lecture } from '../types';
import { virtualModelAi } from './virtual-model-ai';

// 강의 레지스트리.
// 새 강의를 추가하려면: 데이터 파일을 만들고 여기 배열에 import해서 넣기만 하면 된다.
export const lectures: Lecture[] = [virtualModelAi];

export function getLecture(id: string): Lecture | undefined {
  return lectures.find((l) => l.id === id);
}
