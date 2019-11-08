import isWithinRange from 'date-fns/is_within_range'
import parse from 'date-fns/parse'
import setHours from 'date-fns/set_hours'
import setMinutes from 'date-fns/set_minutes'
import format from 'date-fns/format'
import isSameDay from 'date-fns/is_same_day'
import isAfter from 'date-fns/is_after'
import addMinutes from 'date-fns/add_minutes'
import setSeconds from 'date-fns/set_seconds'
import startOfDay from 'date-fns/start_of_day'

export const dateFromMinutes = (minutes, date = new Date()) => addMinutes(startOfDay(date), minutes)

export function dateFromTimeString(time, date) {
	const [hours, minutes] = time.split(':')

	return setSeconds(setHours(setMinutes(date || new Date(), parseInt(minutes, 10)), parseInt(hours, 10)), 0)
}

const getScheduleRangeByDate = (scheduleRanges, date) => {
	return scheduleRanges.find(range => {
		let withinRange

		const start = range.start_date

		if (range.end_date) {
			const end = range.end_date

			if (range.day_of_week === format(date, 'dddd').toLowerCase()) {
				withinRange = isWithinRange(date, start, end) || isSameDay(start, date) || isSameDay(end, date)
			}
		} else {
			if (range.day_of_week === format(date, 'dddd').toLowerCase()) {
				withinRange = isSameDay(date, start) || isAfter(date, start)
			}
		}

		return withinRange
	})
}

export const isWorking = (employee, date) => {
	const range = getScheduleRangeByDate(employee.schedule_ranges, date)

	if (!range) return { working: false }

	const now = new Date()

	const scheduled = range.schedule_shifts.some(shift => {
		return (
			shift.acceptingWalkins &&
			isWithinRange(
				now,
				parse(dateFromTimeString(shift.start_time, now)),
				parse(dateFromTimeString(shift.end_time, now))
			)
		)
	})

	if (!scheduled) {
		return { working: false }
	}

	return {
		working: true
	}
}

export default isWorking
