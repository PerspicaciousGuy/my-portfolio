import type { Arms, Face, Item, Pose } from "./critter-sprite";

/**
 * The hero critter's behaviour as a plain state machine, with no React and no
 * DOM, so the component only wires events and timers to it. Everything is a
 * function of the clock passed in, which keeps it deterministic to test.
 *
 *   follows the pointer along the ground (walks, runs when it is far away),
 *   faces the pointer, looks up when the pointer is high on the page,
 *   click: 1 hop, 2 spin, 3 heart eyes, 4 or more dizzy with stars,
 *   follows a link click with heart eyes, jumps back from a fast scroll,
 *   waves at planes, sulks when rain starts and then opens its umbrella,
 *   in snow looks up, mouth open, and catches flakes (no umbrella),
 *   idle for a while: wanders (sometimes on tiptoe), drinks coffee, sits,
 *   idle for longer: yawns, stretches and falls asleep,
 *   flips the light switch at the right end of the ground,
 *   dances when a "party" cheat fires.
 */
export type Mode = "idle" | "walk" | "sleep" | "sit";
export type Gait = "walk" | "run" | "tip";
type ActName =
  | "jump" | "spin" | "dizzy" | "wave" | "surprise" | "sad" | "heart" | "yawn" | "coffee" | "switch" | "dance";
type Act = { name: ActName; t0: number; dur: number; fired: boolean };

export type CritterView = {
  /** Horizontal position along the lane, percent. */
  cx: number;
  /** Signed scaleX: direction, squashed while turning or spinning. */
  flip: number;
  pose: Pose;
  step: number;
  face: Face;
  arms: Arms;
  item: Item;
  itemT: number;
  squash: number;
  stars: number;
  heart: number;
  lift: number;
  bubble: string;
  wag: boolean;
  blink: boolean;
  look: "side" | "up";
  umbrella: boolean;
  /** Snowflake height above the head (art pixels), 0 for none. */
  flake: number;
  sleeping: boolean;
  /** Step of the rising z's while asleep (0 to 11). */
  zt: number;
  breathe: boolean;
  lights: boolean;
};

export type Lane = { width: number; bottom: number };

/** Art-pixel heights of the click hop, one entry per 60 ms. */
const HOP = [0, 2, 4, 6, 7, 6, 4, 2, 0];
const SPIN = [0.5, 0, -0.5, -1, -0.5, 0, 0.5, 1];
const LOCKED: ActName[] = ["dizzy", "sad", "switch"];

export type BrainEffects = {
  /** The critter flipped the light switch. */
  lights: (on: boolean) => void;
};

export class CritterBrain {
  cx = 30;
  dir = 1;
  mode: Mode = "idle";
  gait: Gait = "walk";
  step = 0;
  turn = 0;
  over = false;
  rain = false;
  snow = false;
  near = false;
  above = false;
  lights = false;
  act: Act | null = null;

  private to = 30;
  private last: number;
  private brainAt = 0;
  private ticks = 0;
  private px: number | null = null;
  private pending = "";
  private clicks = 0;
  private lastClick = 0;
  private chaseAt = 0;
  private surpriseAt = 0;
  private bucket = 0;

  constructor(
    private u: number,
    private fx: BrainEffects,
    private reduce: boolean,
    now: number,
  ) {
    this.last = now;
  }

  private locked() {
    return !!this.act && LOCKED.includes(this.act.name);
  }

  private begin(name: ActName, dur: number, now: number) {
    if (this.reduce) return;
    this.act = { name, t0: now, dur, fired: false };
  }

  /** The visitor is here: wake up, stop sitting, cancel the idle scenes. */
  wake(now: number) {
    this.last = now;
    if (this.mode === "sleep" || this.mode === "sit") this.mode = "idle";
    if (this.act && (this.act.name === "yawn" || this.act.name === "coffee")) this.act = null;
  }

  walkTo(pct: number, gait: Gait): boolean {
    if (this.reduce || this.locked()) return false;
    this.pending = "";
    const to = Math.max(6, Math.min(94, pct));
    const dx = to - this.cx;
    if (Math.abs(dx) < 1.5) return false;
    this.to = to;
    const dir = dx > 0 ? 1 : -1;
    this.turn = dir === this.dir ? 0 : 2;
    this.dir = dir;
    this.mode = "walk";
    this.gait = gait;
    this.act = null;
    return true;
  }

  pointer(x: number, y: number, lane: Lane & { left: number }, overButton: boolean, now: number) {
    this.wake(now);
    this.near = y > lane.bottom - 640 && y < lane.bottom + 40;
    this.above = this.near && y < lane.bottom - 220;
    this.px = (x - lane.left) / Math.max(1, lane.width);
    // Pointer on the ground: the critter comes to it, running when it is far away.
    if (y > lane.bottom - 190 && y < lane.bottom + 10 && now - this.chaseAt > 300) {
      this.chaseAt = now;
      const pct = this.px * 100;
      const d = Math.abs(pct - this.cx);
      if (d > 7 && !overButton) this.walkTo(pct, d > 35 ? "run" : "walk");
    }
  }

  /** A click that was not on the critter or another control. */
  groundClick(x: number, y: number, lane: Lane & { left: number }, now: number) {
    this.wake(now);
    if (y > lane.bottom - 190 && y < lane.bottom + 10) {
      const pct = ((x - lane.left) / lane.width) * 100;
      this.walkTo(pct, Math.abs(pct - this.cx) > 35 ? "run" : "walk");
    }
  }

  linkClick(now: number) {
    if (!this.act && this.mode !== "sleep") this.begin("heart", 1700, now);
  }

  weather(rain: boolean, snow: boolean, now: number) {
    if (rain && !this.rain && this.mode !== "sleep" && !this.locked()) this.begin("sad", 1500, now);
    this.rain = rain;
    this.snow = snow;
  }

  plane(now: number) {
    if (this.mode === "sleep" || this.act || this.mode === "walk") return;
    this.begin("wave", 2600, now);
  }

  ufo(now: number) {
    if (this.mode === "sleep" || this.act || this.mode === "walk") return;
    this.begin("surprise", 1600, now);
  }

  party(now: number) {
    if (this.mode !== "sleep" && !this.locked()) this.begin("dance", 6500, now);
  }

  toggleLights(now: number) {
    this.lights = !this.lights;
    this.fx.lights(this.lights);
    this.last = now;
  }

  /** Fast scroll: jump back. `speed` is px per ms. */
  scrolled(speed: number, now: number) {
    if (speed <= 2.2 || now - this.surpriseAt < 5000 || this.act || this.mode === "sleep") return;
    this.surpriseAt = now;
    this.begin("surprise", 900, now);
  }

  pet(now: number) {
    this.wake(now);
    if (this.locked()) return;
    this.clicks = now - this.lastClick < 1500 ? this.clicks + 1 : 1;
    this.lastClick = now;
    if (this.clicks >= 4) this.begin("dizzy", 2800, now);
    else if (this.clicks === 3) this.begin("heart", 1700, now);
    else if (this.clicks === 2) this.begin("spin", 700, now);
    else this.begin("jump", 780, now);
  }

  /** Walk to the light switch and flip it. `targetPct` is where to stand. */
  gotoSwitch(targetPct: number, now: number) {
    this.wake(now);
    if (this.locked() || this.reduce) return;
    if (this.walkTo(targetPct, Math.abs(targetPct - this.cx) > 35 ? "run" : "walk")) this.pending = "switch";
    else {
      this.dir = 1;
      this.begin("switch", 1200, now);
    }
  }

  /** Advance 50 ms. Returns true when something visible may have changed. */
  tick(now: number, lane: Lane): void {
    this.bucket = Math.floor(now / 250);
    if (this.act) {
      const e = now - this.act.t0;
      if (e >= this.act.dur) {
        const name = this.act.name;
        this.act = null;
        if (name === "yawn") this.mode = "sleep";
      } else if (this.act.name === "switch" && e >= 500 && !this.act.fired) {
        this.act.fired = true;
        this.toggleLights(now);
      }
    }
    if (this.mode === "walk") {
      const mult = this.gait === "run" ? 1.8 : this.gait === "tip" ? 0.5 : 0.8;
      const sp = ((mult * this.u) / (lane.width || 1440)) * 100;
      const dx = this.to - this.cx;
      this.ticks++;
      if (Math.abs(dx) <= sp) {
        this.cx = this.to;
        this.mode = "idle";
        this.step = 0;
        if (this.pending === "switch") {
          this.pending = "";
          this.dir = 1;
          this.begin("switch", 1200, now);
        }
      } else {
        this.cx += Math.sign(dx) * sp;
        if (this.gait === "run" || this.ticks % 2 === 0) this.step = (this.step + 1) % 4;
      }
    }
    if (this.turn > 0) this.turn -= 1;
    // Standing: face the pointer while it is over the hero. Sitting: look left and right.
    if (this.mode === "idle" && this.near && this.px !== null && !this.act) {
      const want = this.px * 100 > this.cx ? 1 : -1;
      if (want !== this.dir) {
        this.dir = want;
        this.turn = 2;
      }
    }
    if (this.mode === "sit" && this.bucket % 8 === 0 && now % 250 < 50) {
      this.dir = -this.dir;
      this.turn = 2;
    }
    // Once a second: decide what to do when the visitor is not moving the pointer.
    if (now - this.brainAt > 1000) {
      this.brainAt = now;
      const idle = now - this.last;
      const free = !this.act;
      if ((this.mode === "idle" || this.mode === "sit") && free && idle > 7500) {
        this.begin("yawn", 1900, now);
        this.mode = "idle";
      } else if (this.mode === "idle" && free && idle > 4000) {
        const r = Math.random();
        if (r < 0.3) this.walkTo(10 + Math.random() * 80, Math.random() < 0.25 ? "tip" : "walk");
        else if (r < 0.45) this.begin("coffee", 4800, now);
        else if (r < 0.6) this.mode = "sit";
      }
    }
  }

  view(now: number): CritterView {
    const sleeping = this.mode === "sleep";
    const a = this.act?.name;
    const e = this.act ? now - this.act.t0 : 0;
    let face: Face = "auto";
    let arms: Arms = "none";
    let item: Item = "none";
    let itemT = 0;
    let squash = 0;
    let stars = 0;
    let heart = 0;
    let lift = 0;
    let bubble = "";
    let spin = 1;
    let flake = 0;

    if (a === "jump") {
      face = "happy";
      if (e < 120) squash = 1;
      else {
        lift = HOP[Math.min(8, Math.floor((e - 120) / 60))];
        if (lift >= 4) arms = "up";
        bubble = "hi!";
      }
    } else if (a === "spin") {
      const i = Math.min(7, Math.floor(e / 80));
      spin = SPIN[i];
      face = "happy";
      lift = i === 3 || i === 4 ? 2 : 0;
    } else if (a === "dizzy") {
      face = "dizzy";
      stars = 1 + (Math.floor(e / 160) % 4);
      bubble = e > 900 ? "" : "?!";
    } else if (a === "wave") {
      face = "happy";
      arms = Math.floor(e / 250) % 2 ? "wave2" : "wave1";
    } else if (a === "surprise") {
      face = "surprised";
      bubble = "!";
      lift = e < 120 ? 2 : 0;
    } else if (a === "sad") {
      face = "sad";
    } else if (a === "heart") {
      face = "heart";
      heart = Math.min(6, 1 + Math.floor(e / 220));
      lift = e < 300 ? 2 : 0;
    } else if (a === "yawn") {
      face = "yawn";
      if (e > 350 && e < 1500) squash = -1;
    } else if (a === "coffee") {
      item = "coffee";
      itemT = Math.floor(e / 400) % 2;
      face = e % 2400 > 1900 ? "wink" : "happy";
    } else if (a === "dance") {
      const k = Math.floor(e / 200);
      face = k % 6 === 5 ? "wink" : "happy";
      arms = k % 2 ? "up" : "wave1";
      lift = k % 2 ? 3 : 0;
      heart = 1 + (Math.floor(e / 260) % 5);
      if (e % 1600 < 560) spin = SPIN[Math.min(7, Math.floor((e % 1600) / 70))];
      bubble = e < 700 ? "party!" : "";
    } else if (a === "switch") {
      arms = "up";
      face = "happy";
    } else if (this.over && !sleeping) {
      face = "happy";
      bubble = "hi!";
    } else if (this.snow && this.mode === "idle") {
      // Catching snowflakes: mouth open, a flake drifting down to it every two seconds.
      face = "surprised";
      flake = 8 - (Math.floor(now / 250) % 8);
    }

    const pose: Pose =
      this.mode === "walk"
        ? this.gait === "run" ? "run" : this.gait === "tip" ? "tiptoe" : "walk"
        : sleeping ? "sleep" : this.mode === "sit" ? "sit" : "stand";

    return {
      cx: this.cx,
      flip: a === "spin" || a === "dance" ? this.dir * spin : this.turn > 0 ? this.dir * 0.35 : this.dir,
      pose,
      step: this.step,
      face,
      arms,
      item,
      itemT,
      squash,
      stars,
      heart,
      lift,
      bubble,
      wag: this.mode === "idle" && !a && Math.floor(this.bucket / 2) % 2 === 1,
      blink: !sleeping && this.bucket % 14 === 0,
      look: this.mode === "idle" && (this.above || this.snow) ? "up" : "side",
      umbrella: this.rain && a !== "sad",
      flake,
      sleeping,
      zt: Math.floor(now / 200) % 12,
      breathe: Math.floor(this.bucket / 6) % 2 === 1,
      lights: this.lights,
    };
  }
}
