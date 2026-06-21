// 교시 타이머: 카운트다운/경과, 일시정지, 색상 상태
// 단일 인스턴스를 앱 전체에서 공유. 매 초 tick 콜백 호출.

class Timer {
  constructor() {
    this.durationSec = 50 * 60;
    this.remainingSec = this.durationSec;
    this.running = false;
    this._intervalId = null;
    this._lastTs = null;
    this._tickCbs = new Set();
    this.label = "";
  }

  onTick(cb) {
    this._tickCbs.add(cb);
    return () => this._tickCbs.delete(cb);
  }

  _emit() {
    this._tickCbs.forEach((cb) => cb(this.state()));
  }

  state() {
    let status = "ready";
    if (this.running) status = "running";
    else if (this.remainingSec <= 0) status = "done";
    else if (this.remainingSec < this.durationSec) status = "paused";

    // 색상 단계: green / amber / red
    let level = "green";
    const ratio = this.durationSec > 0 ? this.remainingSec / this.durationSec : 0;
    if (this.remainingSec <= 0) level = "red";
    else if (this.remainingSec <= 60 || ratio <= 0.1) level = "red";
    else if (ratio <= 0.25) level = "amber";

    return {
      remainingSec: this.remainingSec,
      durationSec: this.durationSec,
      running: this.running,
      status,
      level,
      label: this.label,
      ratio,
    };
  }

  setDuration(min, label = "") {
    this.durationSec = Math.max(1, Math.round(min * 60));
    this.remainingSec = this.durationSec;
    this.label = label;
    this._emit();
  }

  start() {
    if (this.running) return;
    if (this.remainingSec <= 0) this.remainingSec = this.durationSec;
    this.running = true;
    this._lastTs = Date.now();
    this._intervalId = setInterval(() => this._step(), 250);
    this._emit();
  }

  _step() {
    const now = Date.now();
    const dt = (now - this._lastTs) / 1000;
    this._lastTs = now;
    this.remainingSec -= dt;
    if (this.remainingSec <= 0) {
      this.remainingSec = 0;
      this.pause();
      this._notifyEnd();
    }
    this._emit();
  }

  pause() {
    this.running = false;
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this._emit();
  }

  toggle() {
    this.running ? this.pause() : this.start();
  }

  reset() {
    this.pause();
    this.remainingSec = this.durationSec;
    this._emit();
  }

  _notifyEnd() {
    // 진동 + (가능하면) 짧은 비프
    try {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    } catch (e) {}
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = 880;
        g.gain.value = 0.08;
        o.start();
        setTimeout(() => {
          o.stop();
          ctx.close();
        }, 500);
      }
    } catch (e) {}
  }
}

export const timer = new Timer();
