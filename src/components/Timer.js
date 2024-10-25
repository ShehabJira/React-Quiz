import { useEffect } from "react";

function Timer({ secondsRemaining, dispatch }) {
	const mins = Math.trunc(secondsRemaining / 60);
	const secs = secondsRemaining % 60;
	useEffect(
		function () {
			const id = setInterval(() => {
				dispatch({ type: "tick" });
			}, 1000);

			// setInterval will be running even after the component unmounts. So, we need a clean up fn.

			return function () {
				clearInterval(id);
			};
		},
		[dispatch, secondsRemaining]
	);
	return (
		<div className="timer">
			{mins < 10 && "0"}
			{mins}:{secs < 10 && "0"}
			{secs}
		</div>
	);
}

export default Timer;
