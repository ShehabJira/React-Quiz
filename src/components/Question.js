import Options from "./Options";
function Question({ question, dispatch, answer }) {
	return (
		<div>
			<h4>{question.question}</h4>
			<Options question={question} dispatch={dispatch} answer={answer} />
			{/* takes dispatch to update the user answer, and answer so we can paint the correct and wrong answers. of course the question was for displaying the question answers */}
		</div>
	);
}

export default Question;

/*Handling new answers
  When we choose an answer, 3 things happenes:
  first, the correct and the wrong answers are displayed.
  second, the points we got are updated.
  third, the next button(to go to the next question) is displayed.

  In turn, when we click on one of these options we need to re-render the screen,
  so this means we need a new piece of state.
  and that state will store which option is selected. (which was the answer)
  the answer will be the index number of the one of the 4 answers.
*/
