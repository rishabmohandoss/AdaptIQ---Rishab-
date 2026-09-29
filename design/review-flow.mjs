// Acknowledgment is separate from playback: pausing or seeking cannot dismiss feedback.
export class ReviewFlow {
  constructor(moments, duration) {
    this.moments = moments;
    this.duration = duration;
    this.next = 0;
    this.pending = null;
  }
  tick(time) {
    if (this.pending !== null) return this.pending;
    if (this.next < this.moments.length && time >= this.moments[this.next][4] * this.duration) {
      this.pending = this.next;
    }
    return this.pending;
  }
  acknowledge() {
    if (this.pending === null) return false;
    this.next = this.pending + 1;
    this.pending = null;
    return true;
  }
  get complete() { return this.next === this.moments.length && this.pending === null; }
}
