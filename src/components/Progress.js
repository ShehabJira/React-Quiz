function Progress({ index, points, numQuestions, maxPoints, answer }) {
	return (
		<header className="progress">
			<progress
				max={numQuestions}
				value={index + Number(answer !== null)} //if we made it index+1, the bar will get a progress by 1 before we select an option, but as we have written, it will only get that one if the user selected an option first.
			/>
			<p>
				<strong>{index + 1}</strong>/{numQuestions}
			</p>
			<p>
				<strong>{points}</strong>/{maxPoints}
			</p>
		</header>
	);
}

export default Progress;
