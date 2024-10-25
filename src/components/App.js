import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";

const SECS_PER_QUESTION = 30;
// status => "loading", "error", "ready", "active", "finished"  // we will display different UIs based on these situations in the Main component.
const initialState = {
	questions: [],
	status: "loading",
	index: 0, // as we need to display only 1 question at a time, we need to keep track of the current question.
	answer: null, // the chosen answer in each question. (the answer will be the index number of the one of the 4 answers)
	points: 0,
	highscore: 0,
	secondsRemaining: null,
};

function reducer(state, action) {
	switch (action.type) {
		case "dataReceived":
			return { ...state, questions: action.payload, status: "ready" };
		case "dataFailed":
			return { ...state, status: "error" };
		case "start":
			return {
				...state,
				status: "active",
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			};
		case "newAnswer":
			const curQuestion = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload, // update answer with the user selected option index.
				points:
					action.payload === curQuestion.correctOption // answer === curQue.cor?
						? state.points + curQuestion.points
						: state.points,
			}; // we could also do these calculations outside the reducer, so in the Options component, but this will go against the logic of useReducer hook, so but all the logic need in here.
		case "nextQuestion":
			return { ...state, index: state.index + 1, answer: null }; // move to the next question index and reset answer back to null.
		case "finish":
			return {
				...state,
				status: "finished",
				highscore:
					state.points > state.highscore ? state.points : state.highscore,
			};
		case "restart":
			return {
				...initialState,
				status: "ready",
				questions: state.questions,
				highscore: state.highscore,
			};
		case "tick":
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? "finished" : state.status,
			};
		default:
			throw new Error("Action Unknown");
	}
}

export default function App() {
	const [
		{ questions, status, index, answer, points, highscore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState);
	const numQuestions = questions.length;
	const maxPoints = questions.reduce((acc, curr) => acc + curr.points, 0);
	// want to bring the data on mount.
	useEffect(function () {
		fetch("http://localhost:8000/questions")
			.then((res) => res.json())
			.then((data) => dispatch({ type: "dataReceived", payload: data }))
			.catch((err) => dispatch({ type: "dataFailed" }));
	}, []);
	return (
		<div className="app">
			<Header />
			<Main>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen numQuestions={numQuestions} dispatch={dispatch} />
				)}
				{status === "active" && (
					<>
						<Progress
							index={index}
							points={points}
							numQuestions={numQuestions}
							maxPoints={maxPoints}
							answer={answer}
						/>
						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
							<NextButton
								dispatch={dispatch}
								answer={answer}
								index={index}
								numQuestions={numQuestions}
							/>
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen
						points={points}
						maxPoints={maxPoints}
						hightscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}
