function Options({ question, dispatch, answer }) {
	const hasAnswered = answer !== null; // this means he has not answered yet.
	// when he answers, then classify after that each option whether it's correct or wrong.
	return (
		<div className="options">
			{question.options.map((option, index) => (
				<button
					className={`btn btn-option 
          ${
						index === answer ? "answer" : "" // for selected
					} 
          ${
						hasAnswered
							? index === question.correctOption
								? "correct"
								: "wrong"
							: ""
					}`}
					key={option}
					onClick={() => dispatch({ type: "newAnswer", payload: index })}
					disabled={hasAnswered} // if he has answered disable the button
				>
					{option}
				</button>
			))}
		</div>
	);
}

export default Options;
