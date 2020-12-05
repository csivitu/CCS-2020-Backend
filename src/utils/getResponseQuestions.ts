import Question from 'models/question';

export default async function generateResponseQuestions(d: any, r: any) {
	// TODO: change type from any
	const questionNos = r.map((q: any) => q.questionNo);
	const questions = await Question.find(
		{
			questionNo: {
				$in: questionNos,
			},
			domain: d,
		},
		{
			question: 1,
			questionNo: 1,
		},
	).exec();

	questions.sort((a: any, b: any) => questionNos.indexOf(a.questionNo)
	- questionNos.indexOf(b.questionNo));
	// Add question to each corresponding response obj
	const responses = r.toObject();
	for (let i = 0; i < r.length; i += 1) {
		responses[i].question = questions[i].question;
	}
	return responses;
}
