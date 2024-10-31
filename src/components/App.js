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
const questionsData = [
	{
		question: "Which is the most popular JavaScript framework?",
		options: ["Angular", "React", "Svelte", "Vue"],
		correctOption: 1,
		points: 10,
	},
	{
		question: "Which company invented React?",
		options: ["Google", "Apple", "Netflix", "Facebook"],
		correctOption: 3,
		points: 10,
	},
	{
		question: "What's the fundamental building block of React apps?",
		options: ["Components", "Blocks", "Elements", "Effects"],
		correctOption: 0,
		points: 10,
	},
	{
		question: "What's the name of the syntax we use to describe the UI in React components?",
		options: ["FBJ", "Babel", "JSX", "ES2015"],
		correctOption: 2,
		points: 10,
	},
	{
		question: "How does data flow naturally in React apps?",
		options: ["From parents to children", "From children to parents", "Both ways", "The developers decides"],
		correctOption: 0,
		points: 10,
	},
	{
		question: "How to pass data into a child component?",
		options: ["State", "Props", "PropTypes", "Parameters"],
		correctOption: 1,
		points: 10,
	},
	{
		question: "When to use derived state?",
		options: [
			"Whenever the state should not trigger a re-render",
			"Whenever the state can be synchronized with an effect",
			"Whenever the state should be accessible to all components",
			"Whenever the state can be computed from another state variable",
		],
		correctOption: 3,
		points: 30,
	},
	{
		question: "What triggers a UI re-render in React?",
		options: ["Running an effect", "Passing props", "Updating state", "Adding event listeners to DOM elements"],
		correctOption: 2,
		points: 20,
	},
	{
		question: 'When do we directly "touch" the DOM in React?',
		options: ["When we need to listen to an event", "When we need to change the UI", "When we need to add styles", "Almost never"],
		correctOption: 3,
		points: 20,
	},
	{
		question: "In what situation do we use a callback to update state?",
		options: [
			"When updating the state will be slow",
			"When the updated state is very data-intensive",
			"When the state update should happen faster",
			"When the new state depends on the previous state",
		],
		correctOption: 3,
		points: 30,
	},
	{
		question: "If we pass a function to useState, when will that function be called?",
		options: ["On each re-render", "Each time we update the state", "Only on the initial render", "The first time we update the state"],
		correctOption: 2,
		points: 30,
	},
	{
		question: "Which hook to use for an API request on the component's initial render?",
		options: ["useState", "useEffect", "useRef", "useReducer"],
		correctOption: 1,
		points: 10,
	},
	{
		question: "Which variables should go into the useEffect dependency array?",
		options: ["Usually none", "All our state variables", "All state and props referenced in the effect", "All variables needed for clean up"],
		correctOption: 2,
		points: 30,
	},
	{
		question: "An effect will always run on the initial render.",
		options: ["True", "It depends on the dependency array", "False", "In depends on the code in the effect"],
		correctOption: 0,
		points: 30,
	},
	{
		question: "When will an effect run if it doesn't have a dependency array?",
		options: [
			"Only when the component mounts",
			"Only when the component unmounts",
			"The first time the component re-renders",
			"Each time the component is re-rendered",
		],
		correctOption: 3,
		points: 20,
	},
];

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
				highscore: state.points > state.highscore ? state.points : state.highscore,
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
	const [{ questions, status, index, answer, points, highscore, secondsRemaining }, dispatch] = useReducer(reducer, initialState);
	const numQuestions = questions.length;
	const maxPoints = questions.reduce((acc, curr) => acc + curr.points, 0);
	// want to bring the data on mount.
	useEffect(
		function () {
			// GETTING QUESTIONS FROM JSON-SERVER
			// fetch("http://localhost:8000/questions")
			// 	.then((res) => res.json())
			// 	.then((data) => dispatch({ type: "dataReceived", payload: data }))
			// 	.catch((err) => dispatch({ type: "dataFailed" }));

			dispatch({ type: "dataReceived", payload: questionsData });
		},
		[questions]
	);
	return (
		<div className="app">
			<Header />
			<Main>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
				{status === "active" && (
					<>
						<Progress index={index} points={points} numQuestions={numQuestions} maxPoints={maxPoints} answer={answer} />
						<Question question={questions[index]} dispatch={dispatch} answer={answer} />
						<Footer>
							<Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
							<NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
						</Footer>
					</>
				)}
				{status === "finished" && <FinishScreen points={points} maxPoints={maxPoints} hightscore={highscore} dispatch={dispatch} />}
			</Main>
		</div>
	);
}
