import range from 'utils/range';
import shuffle from 'utils/shuffle';

export default function generateQuestionList(lastRandomQ: number, totalQuestions: number):
 Array<number> {
	return shuffle(range(1, lastRandomQ))
		.concat(range(lastRandomQ, totalQuestions + 1));
}
