const QUEUE_KEY = "tourist_safety_offline_queue";

/**
 * Reads the current queue of pending requests from localStorage.
 * Each item is a plain description of what we tried to send —
 * not the actual network request itself (those can't be serialized),
 * just enough info to replay it later.
 */
function getQueue() {
  const raw = localStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

/**
 * Adds a failed request to the queue for later retry.
 * @param {string} type - "ping" or "sos"
 * @param {object} payload - the data that needs to be sent
 */
export function enqueueRequest(type, payload) {
  const queue = getQueue();
  queue.push({ type, payload, queuedAt: new Date().toISOString() });
  saveQueue(queue);
}

export function getQueueLength() {
  return getQueue().length;
}

/**
 * Attempts to send every queued request. Successfully sent items
 * are removed; anything that still fails stays queued for next time.
 * Takes the actual send functions as arguments rather than importing
 * them directly, to avoid a circular import (client.js will need to
 * import this file too).
 */
export async function flushQueue(sendPing, sendSos) {
  const queue = getQueue();
  if (queue.length === 0) return { sent: 0, remaining: 0 };

  const stillQueued = [];
  let sentCount = 0;

    for (const item of queue) {
    try {
      if (item.type === "ping") {
        await sendPing(item.payload.latitude, item.payload.longitude, item.queuedAt);
      } else if (item.type === "sos") {
        await sendSos(item.payload.latitude, item.payload.longitude, item.queuedAt);
      }
      sentCount++;
    } catch (err) {
      // Still failing (maybe connectivity flickered back off) — keep it queued.
      stillQueued.push(item);
    }
  }

  saveQueue(stillQueued);
  return { sent: sentCount, remaining: stillQueued.length };
}