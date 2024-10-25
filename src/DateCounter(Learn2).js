import { useReducer } from "react";

// we usually useReducer when we have complex states to manage, so not just one single value will be on the inital value but many values. In turn, we put all the values in an object.
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
	// state object contains => { count: 0, step: 1 }
	// Note! we should return an object with this same shape. (the initial shape)
	switch (action.type) {
		case "dec":
			return { ...state, count: state.count - state.step };
		case "inc":
			return { ...state, count: state.count + state.step };
		case "setCount":
			return { ...state, count: action.payload };
		case "setStep":
			return { ...state, step: action.payload };
		case "reset":
			return initialState;
		default:
			throw new Error("Unknown action");
	} // Note! states are immutable in react, so reducer shouldn't mutate them.
}
function DateCounter() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { count, step } = state; // current state contains many values, so destructure it.

	// This mutates the date object.
	const date = new Date("june 21 2027");
	date.setDate(date.getDate() + count);

	const dec = function () {
		dispatch({ type: "dec" });
	};
	const inc = function () {
		dispatch({ type: "inc" });
	};
	// dispatch function => requests the update with a request message(action).
	// reducer function  => makes the update
	// state             => needs to be updated
	// action            => how to make the updated according to that request message.

	const defineCount = function (e) {
		dispatch({ type: "setCount", payload: Number(e.target.value) });
	};

	const defineStep = function (e) {
		dispatch({ type: "setStep", payload: Number(e.target.value) });
	};

	const reset = function () {
		dispatch({ type: "reset" });
	};

	return (
		<div className="counter">
			<div>
				<input
					type="range"
					min="1"
					max="10"
					value={step}
					onChange={defineStep}
				/>
				<span>{step}</span>
			</div>

			<div>
				<button onClick={dec}>-</button>
				<input value={count} onChange={defineCount} />
				<button onClick={inc}>+</button>
			</div>

			<p>{date.toDateString()}</p>

			<div>
				<button onClick={reset}>Reset</button>
			</div>
		</div>
	);
}
export default DateCounter;
