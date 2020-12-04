export default function shuffle(array: Array<number>) {
	const newArray = array;
	let i = newArray.length - 1;
	let j; let temp;
	if (i === 0) return newArray;
	while (i) {
		j = Math.floor(Math.random() * (i + 1));
		temp = newArray[i];
		newArray[i] = newArray[j];
		newArray[j] = temp;
		i -= 1;
	}
	return newArray;
}
