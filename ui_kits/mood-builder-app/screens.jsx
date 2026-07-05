/* global React */
// Mood Builder — screen content. Each screen is a function receiving { go }.
const NS = window.MoodBuilderDesignSystem_426a1b;
const { Button, Card, MetricStat, StageBar, ProgressBar, SignalRow, Chip, Slider, EmotionWheel, SpaceTile } = NS;
const { useState, useRef } = React;

const R = "../../assets/renders/";

// ---- small local helpers -------------------------------------------------
function Topline({ back, go, title, right }) {
  return (
    <div className="topline">
      {back ? <span className="back" onClick={() => go(back)}>‹ Back</span> : <span />}
      {title ? <span className="topline__t">{title}</span> : null}
      <span className="topline__r">{right || ""}</span>
    </div>
  );
}
function Eyebrow({ children }) { return <div className="eyebrow">{children}</div>; }
function Title({ children, style }) { return <div className="title" style={style}>{children}</div>; }
function Note({ children, center, strong, style }) {
  return <p className={"note" + (center ? " note--c" : "") + (strong ? " note--strong" : "")} style={style}>{children}</p>;
}

// before/after drag comparison
function ClipCompare() {
  const ref = useRef(null);
  const [p, setP] = useState(50);
  const drag = useRef(false);
  const set = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    setP(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100)));
  };
  const down = (e) => { drag.current = true; set((e.touches ? e.touches[0] : e).clientX); };
  const move = (e) => { if (drag.current) set((e.touches ? e.touches[0] : e).clientX); };
  const up = () => { drag.current = false; };
  return (
    <div className="cmp" ref={ref}
      onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up}
      onTouchStart={down} onTouchMove={move} onTouchEnd={up}>
      <img className="cmp-img" src={R + "space-iso-detail.png"} alt="after" />
      <div className="cmp-side" style={{ clipPath: `inset(0 ${100 - p}% 0 0)` }}>
        <img className="cmp-img cmp-img--mono" src={R + "space-iso-open.png"} alt="before" />
      </div>
      <div className="tagc l">BEFORE · Scared 0.58</div>
      <div className="tagc r">AFTER · Calm 0.62</div>
      <div className="handle" style={{ left: p + "%" }} />
    </div>
  );
}

// ---- 1 · OBSERVE ---------------------------------------------------------
function ScreenObserve({ go }) {
  return (
    <>
      <div className="body body--center">
        <div className="wordmark-lg">Mood <em>Builder</em></div>
        <Title style={{ fontSize: "22px", textAlign: "center", marginTop: "20px" }}>
          A system that translates<br />emotional states into<br />evolving spaces.
        </Title>
        <Note center style={{ marginTop: "16px", maxWidth: "250px" }}>
          Each day you record how you feel. The space remembers, and grows.
        </Note>
      </div>
      <div className="footer"><Button onClick={() => go(2)}>Observe</Button></div>
    </>
  );
}

// ---- 2 · HOME / PHASE ----------------------------------------------------
function ScreenHome({ go }) {
  return (
    <>
      <div className="body">
        <Topline title="" right="Day 14 / Week 3" go={go}>{null}</Topline>
        <div className="eyebrow">Phase</div>
        <Card style={{ margin: "10px 0 12px" }}>
          <MetricStat label="Emotion State" value="Calm" unit="0.62" />
          <Note style={{ marginTop: "8px", fontSize: "13px" }}>Estimated from subjective and physiological input.</Note>
        </Card>
        <div className="field">
          <span style={{ top: "8px", left: "14px" }}>Energy</span>
          <span style={{ bottom: "8px", right: "14px" }}>Pleasantness</span>
          <div className="field-dot" style={{ left: "38%", top: "44%" }} />
        </div>
        <Card tone="paper" style={{ margin: "12px 0" }}>
          <div className="row-split">
            <span className="stage-k">Stage 2 / 5</span>
            <span className="stage-v">Spatial State</span>
          </div>
          <Note style={{ margin: "6px 0 10px" }}>Spatial system evolving</Note>
          <ProgressBar value={50} color="gold" />
          <Note style={{ marginTop: "8px", fontSize: "12.5px", textAlign: "right" }}>Next stage in 3 days</Note>
        </Card>
        <SpaceTile src={R + "space-iso-detail.png"} height={150} />
        <Note center style={{ marginTop: "8px", fontSize: "13px" }}>Spatial configuration at current stage</Note>
      </div>
      <div className="footer">
        <Button onClick={() => go(3)}>Record Today</Button>
        <div className="note note--c" style={{ fontSize: "12.5px" }}>Log emotional and physiological inputs</div>
      </div>
    </>
  );
}

// ---- 3 · SUBJECTIVE ------------------------------------------------------
function ScreenSubjective({ go }) {
  return (
    <>
      <div className="body body--center">
        <Note style={{ position: "absolute", top: "10px", right: "22px", fontSize: "13px" }}>
          Log emotional and physiological signals
        </Note>
        <EmotionWheel caption={false} />
        <Note center style={{ marginTop: "16px" }}>Place where it feels most accurate to you</Note>
        <Note center strong style={{ marginTop: "22px", fontSize: "17px" }}>Subjective input captured</Note>
        <Note center style={{ marginTop: "18px" }}>System calibration in progress</Note>
      </div>
      <div className="footer"><Button onClick={() => go(4)}>Continue</Button></div>
    </>
  );
}

// ---- 4 · CALIBRATE -------------------------------------------------------
function ScreenCalibrate({ go }) {
  return (
    <>
      <div className="body">
        <Topline back={3} go={go} />
        <Title style={{ marginTop: "4px" }}>Physiological<br />signals detected</Title>
        <Note style={{ margin: "6px 0 14px" }}>Used to calibrate emotional state.</Note>
        <Card style={{ padding: "2px 16px" }}>
          <SignalRow label="Heart Rate Variability" status="rest" statusText="Stable" value="72" unit="ms" />
          <SignalRow label="Skin Conductance" status="warn" statusText="Tracking" value="Low" unit="fluctuation" />
          <SignalRow label="Motion" status="rest" statusText="Detected" value="Minimal" />
        </Card>
      </div>
      <div className="footer"><Button onClick={() => go(5)}>Continue</Button></div>
    </>
  );
}

// ---- 5 · GENERATE --------------------------------------------------------
function ScreenGenerate({ go }) {
  return (
    <>
      <div className="body">
        <Topline back={4} go={go} right="Space Generated" />
        <div className="eyebrow">Space Visualization Section</div>
        <SpaceTile src={R + "space-iso-open.png"} height={196} style={{ marginTop: "12px" }} />
        <p className="genline" style={{ marginTop: "16px" }}>Space now feels more <b>serene and open</b>, drawn from your Calm state.</p>
        <div style={{ margin: "16px 0 8px" }}>
          <Button variant="secondary" size="md" onClick={() => go(6)}>Activate Interaction</Button>
        </div>
        <ProgressBar value={50} color="sage" style={{ margin: "10px 0 6px" }} />
        <Note center style={{ fontSize: "13px" }}>Emotion-driven space generated · 50% complete</Note>
      </div>
      <div className="footer"><Button onClick={() => go(6)}>Next</Button></div>
    </>
  );
}

// ---- 6 · ADJUST ----------------------------------------------------------
function ScreenAdjust({ go }) {
  return (
    <>
      <div className="body">
        <Topline back={5} go={go} right="Space Adjustment" />
        <SpaceTile src={R + "space-iso-lush.png"} height={154} style={{ marginTop: "4px", marginBottom: "16px" }} />
        <Slider label="Element Density" defaultValue={52} mode="percent" />
        <Slider label="Color Tone" defaultValue={40} mode="tone" />
        <Slider label="Lighting Intensity" defaultValue={63} mode="percent" />
        <Slider label="Layout Style" defaultValue={30} mode="layout" />
      </div>
      <div className="footer"><Button onClick={() => go(7)}>Next</Button></div>
    </>
  );
}

// ---- 7 · TEMPORAL --------------------------------------------------------
function ScreenTemporal({ go }) {
  return (
    <>
      <div className="body">
        <Topline back={6} go={go} right="Temporal Layer" />
        <div className="row-split">
          <span className="eyebrow">Current Snapshot</span>
          <span className="stage-k">Stage 2 / 5</span>
        </div>
        <Note style={{ margin: "6px 0 10px" }}>Time-gated snapshots of evolving space.</Note>
        <SpaceTile src={R + "space-iso-lush.png"} height={158}
          metaLeft="Captured · Day 14 · 09:41" metaRight="Calm · 0.62" />
        <Note style={{ textAlign: "right", margin: "6px 0 12px", fontSize: "12.5px" }}>Drag to rotate · Pinch to zoom</Note>
        <Slider label="Time Gate" display="Past → Now" defaultValue={80} mode="raw" />
        <div className="row-split" style={{ marginTop: "8px" }}>
          <Note strong style={{ fontSize: "13px" }}>Selected: Day 11</Note>
          <span className="delta-pill">Lighting −8%</span>
        </div>
        <Note style={{ marginTop: "8px", fontSize: "12.5px" }}>Next update in 3 days.</Note>
      </div>
      <div className="footer"><Button onClick={() => go(8)}>View Insights</Button></div>
    </>
  );
}

// ---- 8 · INSIGHTS --------------------------------------------------------
function ScreenInsights({ go }) {
  const [day, setDay] = useState("Day 14");
  return (
    <>
      <div className="body">
        <Topline back={7} go={go} title="Insights" right="Calm · 0.62" />
        <div className="row-split">
          <Title style={{ margin: 0, fontSize: "22px" }}>Stage 2 / 5</Title>
        </div>
        <Note style={{ margin: "4px 0 12px" }}>Last 14 days · Updated Day 14 · 09:41</Note>
        <Card style={{ marginBottom: "12px" }}>
          <div className="k">Key Changes</div>
          <div className="delta"><span><b>Lighting</b><i>Softer contrast, reduced highlights</i></span><span className="d dn">−8%</span></div>
          <div className="delta"><span><b>Element Density</b><i>More vegetation + micro-structures</i></span><span className="d up">+12%</span></div>
          <div className="delta"><span><b>Layout</b><i>Fewer turns, clearer path</i></span><span className="d">More linear</span></div>
        </Card>
        <Card style={{ marginBottom: "12px" }}>
          <div className="k">Drivers</div>
          <div className="splitbar"><div className="o" style={{ width: "55%" }} /><div className="s" style={{ width: "45%" }} /></div>
          <div className="splitlabels"><span>Objective Input 55%</span><span>Subjective Input 45%</span></div>
          <Note style={{ marginTop: "10px", fontSize: "12.5px" }}>HRV remained stable → calm weighting increased. Your placement confirmed the emotion-space mapping.</Note>
        </Card>
        <div className="row-split" style={{ margin: "2px 0 8px" }}>
          <span className="k" style={{ marginBottom: 0 }}>Archive</span>
          <span className="link-q">View all</span>
        </div>
        <div className="chiprow">
          {["Day 3", "Day 7", "Day 11", "Day 14"].map((d) => (
            <Chip key={d} selected={day === d} onClick={() => setDay(d)}>{d}</Chip>
          ))}
        </div>
        <Note style={{ marginTop: "10px", fontSize: "12.5px" }}>Tap a day to open its snapshot.</Note>
      </div>
      <div className="footer"><Button onClick={() => go(9)}>Save Snapshot</Button></div>
    </>
  );
}

// ---- 9 · COMPARE ---------------------------------------------------------
function ScreenCompare({ go }) {
  return (
    <>
      <div className="body">
        <Topline back={8} go={go} title="Compare" right="⋯" />
        <Note style={{ marginTop: "0" }}>Differences between selected snapshots.</Note>
        <div className="cmp-meta">
          <div><b>Day 11 · 22:10</b><i>Scared · 0.58 · Stage 2 / 5</i></div>
          <div style={{ textAlign: "right" }}><b>Day 14 · 09:41</b><i>Calm · 0.62 · Stage 2 / 5</i></div>
        </div>
        <ClipCompare />
        <Note center style={{ margin: "6px 0 0", fontSize: "12.5px" }}>Change focus: lighting · vegetation · path continuity</Note>
      </div>
      <div className="footer">
        <Button variant="secondary" size="md" onClick={() => go(8)}>Back to Archive</Button>
        <Button onClick={() => go(10)}>Open Timeline</Button>
      </div>
    </>
  );
}

// ---- 10 · IMMERSIVE ------------------------------------------------------
function ScreenImmersive({ go }) {
  return (
    <>
      <div className="body body--flush">
        <div className="imm">
          <img className="imm-photo" src={R + "immersive-ruins.png"} alt="immersive interior" />
          <div className="imm-top">
            <span onClick={() => go(8)}>‹ Back</span>
            <span>Calm · 0.62</span>
          </div>
          <div className="imm-meta">
            <div className="imm-e">Immersive mode · Day 14</div>
            <div className="imm-t">Walk inside today</div>
            <div className="imm-s">A first-person view of the space your mood composed.</div>
          </div>
        </div>
      </div>
      <div className="footer footer--dark"><Button variant="onDark" onClick={() => go(1)}>Restart flow</Button></div>
    </>
  );
}

window.MB_SCREENS = {
  1: { label: "Observe", dark: false, render: ScreenObserve },
  2: { label: "Home / Phase", dark: false, render: ScreenHome },
  3: { label: "Subjective", dark: false, render: ScreenSubjective },
  4: { label: "Calibrate", dark: false, render: ScreenCalibrate },
  5: { label: "Generate", dark: false, render: ScreenGenerate },
  6: { label: "Adjust", dark: false, render: ScreenAdjust },
  7: { label: "Temporal", dark: false, render: ScreenTemporal },
  8: { label: "Insights", dark: false, render: ScreenInsights },
  9: { label: "Compare", dark: false, render: ScreenCompare },
  10: { label: "Immersive", dark: true, render: ScreenImmersive },
};
