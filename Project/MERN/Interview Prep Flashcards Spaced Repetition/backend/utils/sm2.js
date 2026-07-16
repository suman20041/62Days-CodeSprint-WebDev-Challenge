/**
 * SM-2 spaced repetition helpers.
 * Ratings map to quality scores: again=1, hard=3, good=4, easy=5
 */

const RATING_QUALITY = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

function applySm2({ easeFactor, interval, repetitions }, rating) {
  const quality = RATING_QUALITY[rating];
  if (quality == null) {
    throw new Error('Invalid rating. Use again, hard, good, or easy.');
  }

  let ef = easeFactor || 2.5;
  let reps = repetitions || 0;
  let ivl = interval || 0;

  if (quality < 3) {
    reps = 0;
    ivl = 1;
  } else {
    if (reps === 0) {
      ivl = 1;
    } else if (reps === 1) {
      ivl = 6;
    } else {
      ivl = Math.round(ivl * ef);
    }
    reps += 1;
  }

  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  const dueDate = new Date();
  dueDate.setHours(0, 0, 0, 0);
  dueDate.setDate(dueDate.getDate() + ivl);

  return {
    easeFactor: Number(ef.toFixed(2)),
    interval: ivl,
    repetitions: reps,
    dueDate,
    lastRating: rating,
    lastReviewedAt: new Date(),
  };
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

module.exports = {
  applySm2,
  RATING_QUALITY,
  startOfToday,
  endOfToday,
  dateKey,
};
