function logarithmic(base_value, index) {
	return Math.log(base_value) * ((index + 1) * 10)
}

function retransmitTimerValuesGenerator(max_attempts, {
	max_timeout = 10000,
	base_value = 250,
	calculate_value_in_ms = logarithmic
} = {}) {

	let num_attempts_left = max_attempts
	let num_attempts = 0

	return {
		//
		// returns the next calculated timeout value that should be used
		//
		getNextTimeoutValue() {
			if (0 > (num_attempts_left - 1)) {
				throw new Error(
					`Called getNextTimeoutValue() after reaching the maximum number of attempts (${num_attempts}/${max_attempts}).`
				)
			}

			let timeout = Math.floor(calculate_value_in_ms(base_value, num_attempts))

			if (timeout > max_timeout) timeout = max_timeout

			++num_attempts;
			--num_attempts_left;

			return timeout
		},

		getNumberOfAttemptsTaken() {
			return num_attempts
		},

		getNumberOfAttemptsLeft() {
			return num_attempts_left
		}
	}
}

retransmitTimerValuesGenerator.fromTimeBudget = function(time_budget, {
	base_value = 250,
	calculate_value_in_ms = logarithmic
} = {}) {
	let timer = retransmitTimerValuesGenerator(Infinity, {
		max_timeout: Infinity,
		base_value,
		calculate_value_in_ms
	})

	let accumulated_time = 0, calculated_number_of_attempts = 0

	while (true) {
		let current_value = timer.getNextTimeoutValue()

		if ((accumulated_time + current_value) > time_budget) break

		accumulated_time += current_value
		++calculated_number_of_attempts
	}

	//
	// sanity check
	//
	if (accumulated_time > time_budget) {
		throw new Error(`Something went wrong, accumulated_time is bigger than time_budget!`)
	}

	return retransmitTimerValuesGenerator(calculated_number_of_attempts, {
		max_timeout: Infinity,
		base_value,
		calculate_value_in_ms
	})
}

retransmitTimerValuesGenerator.algorithms = {logarithmic}

export default retransmitTimerValuesGenerator
