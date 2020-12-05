/* eslint-disable import/extensions */
// TODO: remove this extensions thing
import range from './range';
import shuffle from './shuffle';

export default function generateQuestionList(lastRandomQ: number, totalQuestions: number) {
	shuffle(range(1, lastRandomQ))
		.concat(range(lastRandomQ, totalQuestions + 1));
}
