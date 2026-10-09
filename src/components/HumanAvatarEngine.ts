// Human Avatar Animation Engine for Canvas Video Production
// $0 Cost - 100% Client-Side Procedural 2D Rendering

export type AvatarId = 'farzana' | 'rafi' | 'sheikh-farid';
export type AvatarPose = 'pip-circle' | 'side-anchor' | 'studio-desk';
export type AvatarExpression = 'friendly' | 'confident' | 'serious' | 'enthusiastic';
export type AvatarGesture = 'welcome' | 'point' | 'thumbs-up' | 'news-desk';

export interface AvatarOptions {
  avatarId: AvatarId;
  pose: AvatarPose;
  expression: AvatarExpression;
  gesture: AvatarGesture;
  isSpeaking: boolean;
  speechText?: string;
  theme: 'emerald' | 'amber' | 'cyan' | 'purple';
}

export interface AvatarPresenterProfile {
  id: AvatarId;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  tagline: string;
  gender: 'female' | 'male';
  skinTone: string;
  hairColor: string;
  clothingColor: string;
  accentColor: string;
}

export const AVATAR_PROFILES: Record<AvatarId, AvatarPresenterProfile> = {
  farzana: {
    id: 'farzana',
    name: 'Farzana Ahmed',
    nameBn: 'ফারজানা আহমেদ',
    role: 'GovTech News Anchor',
    roleBn: 'স্মার্ট টিভি ও গভটেক সংবাদ উপস্থাপিকা',
    tagline: 'সাবলীল ও স্পষ্ট বাচনভঙ্গি, পেশাদার উপস্থাপনা',
    gender: 'female',
    skinTone: '#fcd34d',
    hairColor: '#1e293b',
    clothingColor: '#0f766e', // Teal blazer
    accentColor: '#34d399',
  },
  rafi: {
    id: 'rafi',
    name: 'Rafiul Islam',
    nameBn: 'রাফি হাসান',
    role: 'Cyber & AI Specialist',
    roleBn: 'এআই ও সাইবার সুরক্ষা বিশেষজ্ঞ',
    tagline: 'টেকনিক্যাল বিশ্লেষণ ও সরাসরি নির্দেশনামূলক কথা',
    gender: 'male',
    skinTone: '#fde047',
    hairColor: '#0f172a',
    clothingColor: '#1e1b4b', // Deep indigo blazer
    accentColor: '#38bdf8',
  },
  'sheikh-farid': {
    id: 'sheikh-farid',
    name: 'Sheikh Farid',
    nameBn: 'শেখ ফরিদ',
    role: 'Chief AI Architect',
    roleBn: 'চিফ এআই সফটওয়্যার আর্কিটেক্ট',
    tagline: 'গবেষক, উদ্ভাবক ও জাতীয় প্রযুক্তি পরামর্শক',
    gender: 'male',
    skinTone: '#fbcfe8',
    hairColor: '#334155',
    clothingColor: '#312e81', // Royal Navy Suit
    accentColor: '#c084fc',
  },
};

/**
 * Draws the human digital avatar with natural body sway, breathing, blinking,
 * head nod, eye saccades, lip-syncing mouth and hand gestures.
 */
export function drawHumanAvatar(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  elapsed: number,
  options: AvatarOptions
) {
  const { avatarId, pose, expression, gesture, isSpeaking, speechText, theme } = options;
  const profile = AVATAR_PROFILES[avatarId] || AVATAR_PROFILES.farzana;

  // --- Dynamic Mathematical Body Kinetics ---
  // 1. Natural Breathing: Torso rises and falls gently (frequency: ~0.35 Hz)
  const breathY = Math.sin(elapsed * 2.2) * 2.5;

  // 2. Head Tilt & Nod: Speaking causes natural rhythmic micro-nods and pauses
  const headNodAngle = isSpeaking
    ? Math.sin(elapsed * 5.2) * 0.045 + Math.sin(elapsed * 1.8) * 0.02
    : Math.sin(elapsed * 1.4) * 0.02;
  const headSwayX = Math.cos(elapsed * 1.6) * 2;

  // 3. Eye Blinking: Real human blink occurs every 3.5s and lasts ~0.16s
  const blinkCycle = elapsed % 3.6;
  const isBlinking = blinkCycle > 3.42 && blinkCycle < 3.58;

  // 4. Pupil Saccades: Eyes move subtly in saccadic jumps
  const saccadeStep = Math.floor(elapsed / 1.8);
  const pupilOffsetX = Math.sin(saccadeStep * 4.3) * 2.2;
  const pupilOffsetY = Math.cos(saccadeStep * 2.7) * 1.2;

  // 5. Lip Sync & Mouth Visemes:
  // Dynamically cycles through phonemes (closed, open 'ah', round 'oh', smile 'ee') when speaking
  const phonemeCycle = elapsed * 15;
  const mouthOpen = isSpeaking
    ? Math.max(2, Math.abs(Math.sin(phonemeCycle)) * 12 + Math.sin(elapsed * 7) * 3)
    : 1.5;
  const mouthRoundness = isSpeaking ? (Math.cos(phonemeCycle * 0.6) + 1) * 3 : 0;

  // 6. Eyebrow Height (Expression dependent)
  let browOffset = 0;
  if (expression === 'enthusiastic') browOffset = -3.5;
  else if (expression === 'serious') browOffset = 2.0;
  else if (expression === 'confident') browOffset = -1.5;
  if (isSpeaking) {
    browOffset += Math.sin(elapsed * 4) * 1.5; // Eyebrows raise on emphasis
  }

  // --- Layout Positioning based on Pose ---
  ctx.save();

  if (pose === 'pip-circle') {
    // Picture-in-Picture Round Presenter Bubble at bottom-right
    const bubbleRadius = Math.min(canvasWidth * 0.16, 75);
    const bubbleCenterX = canvasWidth - bubbleRadius - 24;
    const bubbleCenterY = canvasHeight - (canvasWidth < 600 ? 150 : 130);

    // Glowing border ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(bubbleCenterX, bubbleCenterY, bubbleRadius + 4, 0, Math.PI * 2);
    ctx.fillStyle = profile.accentColor;
    ctx.shadowColor = profile.accentColor;
    ctx.shadowBlur = isSpeaking ? 16 : 8;
    ctx.fill();

    // Mask circle
    ctx.beginPath();
    ctx.arc(bubbleCenterX, bubbleCenterY, bubbleRadius, 0, Math.PI * 2);
    ctx.clip();

    // Circle background gradient
    const bgGrad = ctx.createLinearGradient(
      bubbleCenterX,
      bubbleCenterY - bubbleRadius,
      bubbleCenterX,
      bubbleCenterY + bubbleRadius
    );
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(
      bubbleCenterX - bubbleRadius,
      bubbleCenterY - bubbleRadius,
      bubbleRadius * 2,
      bubbleRadius * 2
    );

    // Render human bust inside circle
    const avatarScale = bubbleRadius / 65;
    ctx.translate(bubbleCenterX, bubbleCenterY + bubbleRadius * 0.35 + breathY);
    renderHumanFigure(ctx, avatarScale, profile, {
      breathY,
      headNodAngle,
      headSwayX,
      isBlinking,
      pupilOffsetX,
      pupilOffsetY,
      mouthOpen,
      mouthRoundness,
      browOffset,
      isSpeaking,
      gesture,
      elapsed,
    });
    ctx.restore();

    // Presenter name badge under PIP
    ctx.save();
    ctx.font = 'bold 11px "Hind Siliguri", sans-serif';
    const tagText = `🎙️ ${profile.nameBn}`;
    const tagMetrics = ctx.measureText(tagText);
    const tagW = tagMetrics.width + 16;
    const tagX = bubbleCenterX - tagW / 2;
    const tagY = bubbleCenterY + bubbleRadius - 8;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = profile.accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY, tagW, 20, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(tagText, bubbleCenterX, tagY + 14);
    ctx.restore();

    // Floating speech bubble if speaking
    if (isSpeaking && speechText) {
      drawSpeechBubble(
        ctx,
        bubbleCenterX - bubbleRadius - 15,
        bubbleCenterY - 15,
        speechText,
        'right',
        profile.accentColor
      );
    }
  } else if (pose === 'side-anchor') {
    // Standing Presenter Anchor on Left or Right
    const isPortrait = canvasHeight > canvasWidth;
    const anchorScale = isPortrait ? 1.05 : 1.35;
    const anchorX = isPortrait ? canvasWidth * 0.82 : canvasWidth * 0.80;
    const anchorY = canvasHeight * 0.88 + breathY;

    ctx.translate(anchorX, anchorY);
    renderHumanFigure(ctx, anchorScale, profile, {
      breathY,
      headNodAngle,
      headSwayX,
      isBlinking,
      pupilOffsetX,
      pupilOffsetY,
      mouthOpen,
      mouthRoundness,
      browOffset,
      isSpeaking,
      gesture,
      elapsed,
    });

    // Anchor Lower Third Nameplate
    ctx.restore();
    ctx.save();
    const plateWidth = 140;
    const plateX = anchorX - plateWidth / 2;
    const plateY = canvasHeight * 0.89;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = profile.accentColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(plateX, plateY, plateWidth, 26, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(profile.nameBn, anchorX, plateY + 17);
    ctx.restore();

    // Floating speech bubble
    if (isSpeaking && speechText) {
      drawSpeechBubble(
        ctx,
        anchorX - 110,
        canvasHeight * 0.48,
        speechText,
        'right',
        profile.accentColor
      );
    }
    return;
  } else {
    // Studio Broadcast Desk Presenter
    const deskScale = canvasWidth < 600 ? 1.05 : 1.25;
    const deskCenterX = canvasWidth * 0.5;
    const deskCenterY = canvasHeight * 0.76 + breathY;

    // Draw Human figure behind the desk
    ctx.save();
    ctx.translate(deskCenterX, deskCenterY);
    renderHumanFigure(ctx, deskScale, profile, {
      breathY,
      headNodAngle,
      headSwayX,
      isBlinking,
      pupilOffsetX,
      pupilOffsetY,
      mouthOpen,
      mouthRoundness,
      browOffset,
      isSpeaking,
      gesture,
      elapsed,
    });
    ctx.restore();

    // Modern Curved Glass Studio Desk with LED Accent
    const deskW = Math.min(canvasWidth * 0.82, 540);
    const deskH = 65;
    const deskX = deskCenterX - deskW / 2;
    const deskY = canvasHeight * 0.78;

    // Desk glowing rim
    ctx.save();
    const deskGrad = ctx.createLinearGradient(deskX, deskY, deskX + deskW, deskY);
    deskGrad.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    deskGrad.addColorStop(0.5, 'rgba(30, 41, 59, 0.92)');
    deskGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');

    ctx.fillStyle = deskGrad;
    ctx.strokeStyle = profile.accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(deskX, deskY, deskW, deskH, [18, 18, 4, 4]);
    ctx.fill();
    ctx.stroke();

    // Studio Desk LED Strip
    ctx.strokeStyle = profile.accentColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = profile.accentColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(deskX + 15, deskY + 6);
    ctx.lineTo(deskX + deskW - 15, deskY + 6);
    ctx.stroke();

    // Desk Broadcast Microphone
    const micX = deskCenterX - 70;
    const micY = deskY + 12;
    ctx.fillStyle = '#64748b';
    ctx.fillRect(micX - 3, micY - 25, 6, 25);
    ctx.beginPath();
    ctx.arc(micX, micY - 28, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Active ON-AIR indicator on microphone
    if (isSpeaking) {
      ctx.beginPath();
      ctx.arc(micX, micY - 32, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    // Studio Nameplate
    ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;
    ctx.fillText(`${profile.nameBn} • ${profile.roleBn}`, deskCenterX, deskY + 36);

    ctx.restore();

    // Floating speech bubble
    if (isSpeaking && speechText) {
      drawSpeechBubble(
        ctx,
        deskCenterX,
        deskY - 140,
        speechText,
        'bottom',
        profile.accentColor
      );
    }
  }

  ctx.restore();
}

/**
 * Draws the anatomical human figure: Torso, Neck, Head, Hair, Eyes, Eyebrows, Mouth, and Arms
 */
function renderHumanFigure(
  ctx: CanvasRenderingContext2D,
  scale: number,
  profile: AvatarPresenterProfile,
  kinetics: {
    breathY: number;
    headNodAngle: number;
    headSwayX: number;
    isBlinking: boolean;
    pupilOffsetX: number;
    pupilOffsetY: number;
    mouthOpen: number;
    mouthRoundness: number;
    browOffset: number;
    isSpeaking: boolean;
    gesture: AvatarGesture;
    elapsed: number;
  }
) {
  const {
    headNodAngle,
    headSwayX,
    isBlinking,
    pupilOffsetX,
    pupilOffsetY,
    mouthOpen,
    mouthRoundness,
    browOffset,
    isSpeaking,
    gesture,
    elapsed,
  } = kinetics;

  ctx.save();
  ctx.scale(scale, scale);

  // 1. TORSO & CLOTHING (Shoulders and Blazer/Suit)
  ctx.save();
  // Shoulders contour
  ctx.beginPath();
  ctx.moveTo(-55, 30);
  ctx.bezierCurveTo(-50, 0, -25, -12, 0, -12);
  ctx.bezierCurveTo(25, -12, 50, 0, 55, 30);
  ctx.lineTo(65, 95);
  ctx.lineTo(-65, 95);
  ctx.closePath();

  // Suit / Blazer Color
  ctx.fillStyle = profile.clothingColor;
  ctx.fill();

  // Inner Shirt / Collar
  ctx.beginPath();
  ctx.moveTo(-16, -12);
  ctx.lineTo(0, 15);
  ctx.lineTo(16, -12);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Tie (for male characters) or Scarf/Lapel (for female)
  if (profile.gender === 'male') {
    ctx.beginPath();
    ctx.moveTo(-5, 12);
    ctx.lineTo(5, 12);
    ctx.lineTo(8, 65);
    ctx.lineTo(0, 78);
    ctx.lineTo(-8, 65);
    ctx.closePath();
    ctx.fillStyle = profile.accentColor;
    ctx.fill();
  } else {
    // Lapel brooch / jewelry
    ctx.beginPath();
    ctx.arc(-22, 10, 4, 0, Math.PI * 2);
    ctx.fillStyle = profile.accentColor;
    ctx.fill();
  }

  // Lapel Microphone attached to collar
  ctx.beginPath();
  ctx.rect(14, 4, 4, 9);
  ctx.fillStyle = '#0f172a';
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();

  // 2. HAND GESTURES (Acting & Body Language)
  renderHandGestures(ctx, gesture, profile, elapsed, isSpeaking);

  // 3. NECK
  ctx.save();
  ctx.fillStyle = darkenColor(profile.skinTone, 15);
  ctx.beginPath();
  ctx.rect(-11, -30, 22, 24);
  ctx.fill();
  ctx.restore();

  // 4. HEAD (With nod, tilt and sway)
  ctx.save();
  ctx.translate(headSwayX, -45);
  ctx.rotate(headNodAngle);

  // Ears
  ctx.fillStyle = profile.skinTone;
  ctx.beginPath();
  ctx.arc(-27, 0, 6, 0, Math.PI * 2); // Left ear
  ctx.arc(27, 0, 6, 0, Math.PI * 2);  // Right ear
  ctx.fill();

  // Earrings if Farzana
  if (profile.id === 'farzana') {
    ctx.fillStyle = profile.accentColor;
    ctx.beginPath();
    ctx.arc(-27, 7, 2.5, 0, Math.PI * 2);
    ctx.arc(27, 7, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Head base shape (face oval)
  ctx.fillStyle = profile.skinTone;
  ctx.beginPath();
  ctx.ellipse(0, 0, 26, 32, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chin and jaw subtle shading
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.beginPath();
  ctx.arc(0, 20, 14, 0, Math.PI);
  ctx.fill();

  // 5. HAIR
  renderHair(ctx, profile);

  // 6. EYES & BROWS
  // Eyebrows
  ctx.strokeStyle = profile.hairColor;
  ctx.lineWidth = profile.gender === 'male' ? 3.2 : 2.2;
  ctx.lineCap = 'round';

  // Left Eyebrow
  ctx.beginPath();
  ctx.moveTo(-18, -14 + browOffset);
  ctx.quadraticCurveTo(-11, -18 + browOffset, -4, -13 + browOffset);
  ctx.stroke();

  // Right Eyebrow
  ctx.beginPath();
  ctx.moveTo(4, -13 + browOffset);
  ctx.quadraticCurveTo(11, -18 + browOffset, 18, -14 + browOffset);
  ctx.stroke();

  // Eyes (Blinking vs Open)
  const eyeY = -4;
  if (isBlinking) {
    // Closed Eyelids (Blink)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-17, eyeY);
    ctx.quadraticCurveTo(-11, eyeY + 3, -5, eyeY);
    ctx.moveTo(5, eyeY);
    ctx.quadraticCurveTo(11, eyeY + 3, 17, eyeY);
    ctx.stroke();
  } else {
    // Open Eyes with Saccades
    // Left Eye White
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-11, eyeY, 6.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Right Eye White
    ctx.beginPath();
    ctx.ellipse(11, eyeY, 6.5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Irises & Pupils
    const irisColor = profile.id === 'farzana' ? '#78350f' : profile.id === 'rafi' ? '#0f172a' : '#1e3a8a';
    ctx.fillStyle = irisColor;

    // Left Iris
    ctx.beginPath();
    ctx.arc(-11 + pupilOffsetX, eyeY + pupilOffsetY, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Right Iris
    ctx.beginPath();
    ctx.arc(11 + pupilOffsetX, eyeY + pupilOffsetY, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Catchlight (White shine)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-12 + pupilOffsetX, eyeY + pupilOffsetY - 1, 1, 0, Math.PI * 2);
    ctx.arc(10 + pupilOffsetX, eyeY + pupilOffsetY - 1, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Glasses (for Rafi or Sheikh Farid)
  if (profile.id === 'rafi' || profile.id === 'sheikh-farid') {
    ctx.strokeStyle = profile.id === 'rafi' ? '#38bdf8' : '#e2e8f0';
    ctx.lineWidth = 1.5;
    // Left rim
    ctx.strokeRect(-18, eyeY - 7, 14, 13);
    // Right rim
    ctx.strokeRect(4, eyeY - 7, 14, 13);
    // Bridge
    ctx.beginPath();
    ctx.moveTo(-4, eyeY);
    ctx.lineTo(4, eyeY);
    ctx.stroke();
  }

  // 7. NOSE
  ctx.strokeStyle = darkenColor(profile.skinTone, 25);
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, -3);
  ctx.lineTo(1.5, 6);
  ctx.lineTo(-2, 8);
  ctx.stroke();

  // 8. MOUTH & LIP-SYNC (কথা বলা ও ঠোঁটের নড়াচড়া)
  const mouthY = 17;
  const mouthWidth = 14 + mouthRoundness;

  if (isSpeaking) {
    // Talking Mouth Opening with Viseme Shapes
    ctx.fillStyle = '#881337'; // Mouth interior
    ctx.beginPath();
    ctx.ellipse(0, mouthY, mouthWidth / 2, mouthOpen / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Upper Teeth hint
    if (mouthOpen > 6) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-mouthWidth / 3, mouthY - mouthOpen / 2, (mouthWidth * 2) / 3, 2.5);
    }

    // Lips outline
    ctx.strokeStyle = profile.gender === 'female' ? '#e11d48' : '#be123c';
    ctx.lineWidth = profile.gender === 'female' ? 2.2 : 1.5;
    ctx.beginPath();
    ctx.ellipse(0, mouthY, mouthWidth / 2, mouthOpen / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Resting Natural Gentle Smile
    ctx.strokeStyle = profile.gender === 'female' ? '#e11d48' : '#be123c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, mouthY);
    ctx.quadraticCurveTo(0, mouthY + 4, 8, mouthY);
    ctx.stroke();
  }

  ctx.restore(); // Head restore
  ctx.restore(); // Main figure restore
}

/**
 * Hair rendering per avatar character
 */
function renderHair(ctx: CanvasRenderingContext2D, profile: AvatarPresenterProfile) {
  ctx.save();
  ctx.fillStyle = profile.hairColor;

  if (profile.id === 'farzana') {
    // Sleek news anchor bob hair
    ctx.beginPath();
    ctx.moveTo(-28, -8);
    ctx.bezierCurveTo(-32, -38, 32, -38, 28, -8);
    ctx.bezierCurveTo(34, 15, 24, 25, 22, 10);
    ctx.bezierCurveTo(15, -15, -15, -15, -22, 10);
    ctx.bezierCurveTo(-24, 25, -34, 15, -28, -8);
    ctx.closePath();
    ctx.fill();
  } else if (profile.id === 'rafi') {
    // Modern styled undercut tech hair
    ctx.beginPath();
    ctx.moveTo(-27, -10);
    ctx.bezierCurveTo(-26, -42, 26, -42, 27, -10);
    ctx.bezierCurveTo(18, -25, -18, -25, -27, -10);
    ctx.closePath();
    ctx.fill();
  } else {
    // Distinguished senior architect hairstyle with graying temples
    ctx.beginPath();
    ctx.moveTo(-27, -6);
    ctx.bezierCurveTo(-28, -40, 28, -40, 27, -6);
    ctx.bezierCurveTo(20, -22, -20, -22, -27, -6);
    ctx.closePath();
    ctx.fill();

    // Gray sideburns
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.rect(-27, -10, 3, 14);
    ctx.rect(24, -10, 3, 14);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Hand Gestures (acting, pointing, welcoming, thumbs up)
 */
function renderHandGestures(
  ctx: CanvasRenderingContext2D,
  gesture: AvatarGesture,
  profile: AvatarPresenterProfile,
  elapsed: number,
  isSpeaking: boolean
) {
  ctx.save();
  const gestureFloat = Math.sin(elapsed * 2.5) * 3;

  if (gesture === 'point') {
    // Pointing with left/right hand towards slide content
    ctx.save();
    ctx.translate(-45, 45 + gestureFloat);
    ctx.rotate(-0.4);

    // Sleeve
    ctx.fillStyle = profile.clothingColor;
    ctx.beginPath();
    ctx.roundRect(-8, -12, 16, 32, 6);
    ctx.fill();

    // Hand pointing
    ctx.fillStyle = profile.skinTone;
    ctx.beginPath();
    ctx.roundRect(-6, 20, 12, 16, 4);
    ctx.fill();

    // Extended Index Finger
    ctx.fillRect(-18, 22, 14, 5);
    ctx.restore();
  } else if (gesture === 'welcome') {
    // Welcoming open palms gesture
    ctx.save();
    ctx.translate(45, 50 + gestureFloat);
    ctx.rotate(0.3);

    // Sleeve
    ctx.fillStyle = profile.clothingColor;
    ctx.beginPath();
    ctx.roundRect(-8, -12, 16, 30, 6);
    ctx.fill();

    // Open Palm Hand
    ctx.fillStyle = profile.skinTone;
    ctx.beginPath();
    ctx.arc(0, 24, 8, 0, Math.PI * 2);
    ctx.fill();
    // Fingers spread
    for (let i = -3; i <= 3; i += 2) {
      ctx.fillRect(i * 2 - 2, 24, 4, 10);
    }
    ctx.restore();
  } else if (gesture === 'thumbs-up') {
    // Thumbs up gesture
    ctx.save();
    ctx.translate(42, 42 + gestureFloat);

    // Sleeve
    ctx.fillStyle = profile.clothingColor;
    ctx.beginPath();
    ctx.roundRect(-8, -12, 16, 30, 6);
    ctx.fill();

    // Fist with thumb up
    ctx.fillStyle = profile.skinTone;
    ctx.beginPath();
    ctx.arc(0, 22, 7, 0, Math.PI * 2);
    ctx.fill();
    // Thumb
    ctx.fillRect(-2, 10, 5, 10);
    ctx.restore();
  } else {
    // News Desk / Idle resting hands
    ctx.save();
    ctx.translate(0, 75);
    ctx.fillStyle = profile.skinTone;
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Floating speech bubble with animated voice frequency bars
 */
function drawSpeechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  arrowDir: 'left' | 'right' | 'bottom',
  accentColor: string
) {
  ctx.save();

  ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
  const cleanText = text.length > 40 ? text.slice(0, 38) + '...' : text;
  const textMetrics = ctx.measureText(cleanText);
  const bubbleW = Math.max(textMetrics.width + 42, 160);
  const bubbleH = 38;

  let bubbleX = x;
  let bubbleY = y;

  if (arrowDir === 'right') {
    bubbleX = x - bubbleW;
    bubbleY = y - bubbleH / 2;
  } else if (arrowDir === 'left') {
    bubbleX = x;
    bubbleY = y - bubbleH / 2;
  } else {
    bubbleX = x - bubbleW / 2;
    bubbleY = y - bubbleH;
  }

  // Glass card bubble
  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 12);
  ctx.fill();
  ctx.stroke();

  // Equalizer animation in bubble (3 bars)
  const now = performance.now() / 1000;
  ctx.fillStyle = accentColor;
  for (let b = 0; b < 3; b++) {
    const barH = 5 + Math.sin(now * 12 + b * 2) * 4;
    ctx.fillRect(bubbleX + 14 + b * 5, bubbleY + bubbleH / 2 - barH / 2, 3, barH);
  }

  // Spoken text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.fillText(cleanText, bubbleX + 34, bubbleY + 23);

  ctx.restore();
}

// Color utility helper
function darkenColor(hex: string, percent: number): string {
  let num = parseInt(hex.replace('#', ''), 16);
  let amt = Math.round(2.55 * percent);
  let R = (num >> 16) - amt;
  let G = ((num >> 8) & 0x00ff) - amt;
  let B = (num & 0x0000ff) - amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}
