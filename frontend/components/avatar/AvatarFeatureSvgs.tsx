import type {
  AvatarEyebrowOptionId,
  AvatarEyeOptionId,
  AvatarMouthOptionId,
  AvatarNoseOptionId,
} from "@/components/avatar/avatarOptions";

type AvatarSvgProps = {
  className?: string;
};

type ColoredAvatarSvgProps = AvatarSvgProps & {
  color: string;
};

export function AvatarEyebrowsSvg({
  className,
  color,
  eyebrowId,
}: Readonly<
  ColoredAvatarSvgProps & {
    eyebrowId: AvatarEyebrowOptionId;
  }
>) {
  if (eyebrowId === "eyebrow_02") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 30 Q110 5 160 35"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="8"
        />
        <path
          d="M220 35 Q270 5 320 30"
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeWidth="8"
        />
      </svg>
    );
  }

  if (eyebrowId === "eyebrow_03") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M55 32 Q105 0 165 50 Q105 25 65 52 Z" fill={color} />
        <path d="M325 32 Q275 0 215 50 Q275 25 315 52 Z" fill={color} />
      </svg>
    );
  }

  if (eyebrowId === "eyebrow_04") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M85 52 L170 78 L155 90 L95 72 Z"
          fill={color}
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d="M295 52 L210 78 L225 90 L285 72 Z"
          fill={color}
          stroke={color}
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 380 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M75 38 C105 22, 135 26, 158 44"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="10"
      />
      <path
        d="M225 44 C248 26, 278 22, 308 38"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="10"
      />
    </svg>
  );
}

export function AvatarEyesSvg({
  className,
  color,
  eyeId,
}: Readonly<
  ColoredAvatarSvgProps & {
    eyeId: AvatarEyeOptionId;
  }
>) {
  if (eyeId === "eye_02") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 95 L90 60 Q130 55 160 90 Q120 115 60 95 Z"
          fill="#fff"
          stroke="#000"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <path
          d="M320 95 L290 60 Q250 55 220 90 Q260 115 320 95 Z"
          fill="#fff"
          stroke="#000"
          strokeLinejoin="round"
          strokeWidth="6"
        />
        <ellipse
          cx="115"
          cy="85"
          fill={color}
          rx="20"
          ry="22"
          stroke="#000"
          strokeWidth="6"
        />
        <circle cx="115" cy="85" fill="#000" r="6" />
        <ellipse
          cx="265"
          cy="85"
          fill={color}
          rx="20"
          ry="22"
          stroke="#000"
          strokeWidth="6"
        />
        <circle cx="265" cy="85" fill="#000" r="6" />
        <path
          d="M70 110 Q110 120 150 110"
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M230 110 Q270 120 310 110"
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeWidth="6"
        />
      </svg>
    );
  }

  if (eyeId === "eye_03") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M78 62 Q103 36 142 44 Q165 52 176 86 Q168 112 153 125 L88 125 Q70 92 78 62 Z"
          fill="#fff"
          stroke="#111"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <path
          d="M302 62 Q277 36 238 44 Q215 52 204 86 Q212 112 227 125 L292 125 Q310 92 302 62 Z"
          fill="#fff"
          stroke="#111"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <ellipse cx="132" cy="87" fill={color} rx="8" ry="17" />
        <ellipse cx="248" cy="87" fill={color} rx="8" ry="17" />
        <path
          d="M92 135 Q118 129 148 134"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M98 144 Q122 138 152 143"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M232 134 Q262 129 288 135"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M228 143 Q258 138 282 144"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    );
  }

  if (eyeId === "eye_04") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M115 78 L175 87 L160 113 L125 113 Z"
          fill="#fff"
          stroke="#111"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <path
          d="M265 78 L205 87 L220 113 L255 113 Z"
          fill="#fff"
          stroke="#111"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <ellipse
          cx="145"
          cy="98"
          fill={color}
          rx="12"
          ry="9"
          stroke="#111"
          strokeWidth="3"
        />
        <ellipse
          cx="235"
          cy="98"
          fill={color}
          rx="12"
          ry="9"
          stroke="#111"
          strokeWidth="3"
        />
        <circle cx="145" cy="98" fill="#111" r="4" />
        <circle cx="235" cy="98" fill="#111" r="4" />
        <path
          d="M125 124 L155 120"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M225 120 L255 124"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    );
  }

  if (eyeId === "eye_05") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M85 98 Q125 58 165 98"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="8"
        />
        <path
          d="M215 98 Q255 58 295 98"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="8"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 380 160"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M70 78 C92 45, 140 45, 164 78 C140 112, 94 112, 70 78 Z"
        fill="#ffffff"
        stroke="#1b120d"
        strokeWidth="5"
      />
      <path
        d="M216 78 C240 45, 288 45, 310 78 C286 112, 240 112, 216 78 Z"
        fill="#ffffff"
        stroke="#1b120d"
        strokeWidth="5"
      />
      <circle
        cx="118"
        cy="78"
        fill={color}
        r="22"
        stroke="#1b120d"
        strokeWidth="4"
      />
      <circle cx="118" cy="78" fill="#111111" r="10" />
      <circle cx="110" cy="68" fill="#ffffff" r="5" />
      <circle
        cx="262"
        cy="78"
        fill={color}
        r="22"
        stroke="#1b120d"
        strokeWidth="4"
      />
      <circle cx="262" cy="78" fill="#111111" r="10" />
      <circle cx="254" cy="68" fill="#ffffff" r="5" />
    </svg>
  );
}

export function AvatarNoseSvg({
  className,
  noseId,
}: Readonly<
  AvatarSvgProps & {
    noseId: AvatarNoseOptionId;
  }
>) {
  if (noseId === "nose_02") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M185 85 Q178 100 172 115 Q182 120 192 110 Z"
          fill="#111"
        />
      </svg>
    );
  }

  if (noseId === "nose_03") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M165 105 A 35 35 0 1 1 215 105"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="5"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 380 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M170 105 Q190 125 210 105"
        fill="none"
        stroke="#111"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M175 105 Q180 112 185 105"
        fill="none"
        stroke="#111"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M195 105 Q200 112 205 105"
        fill="none"
        stroke="#111"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export function AvatarMouthSvg({
  className,
  mouthId,
}: Readonly<
  AvatarSvgProps & {
    mouthId: AvatarMouthOptionId;
  }
>) {
  if (mouthId === "mouth_02") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 260"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M95 48 Q190 20 285 48 Q300 72 292 115 L276 198 Q260 230 190 235 Q120 230 104 198 L88 115 Q80 72 95 48 Z"
          fill="#130005"
          stroke="#111"
          strokeLinejoin="round"
          strokeWidth="8"
        />
        <path
          d="M100 45 Q190 20 280 45 Q290 70 278 88 Q235 78 190 78 Q145 78 102 88 Q90 70 100 45 Z"
          fill="#fff"
          stroke="#111"
          strokeLinejoin="round"
          strokeWidth="7"
        />
        <path
          d="M100 178 Q135 125 190 160 Q245 125 280 178 Q260 218 190 220 Q120 218 100 178 Z"
          fill="#ef2f9a"
          stroke="#111"
          strokeLinejoin="round"
          strokeWidth="7"
        />
        <path
          d="M113 176 Q140 142 190 168 Q240 142 267 176"
          fill="none"
          stroke="#ff65b5"
          strokeLinecap="round"
          strokeWidth="9"
        />
        <path
          d="M105 198 Q145 224 190 225 Q235 224 275 198 Q258 232 190 238 Q122 232 105 198 Z"
          fill="#fff"
          stroke="#111"
          strokeLinejoin="round"
          strokeWidth="7"
        />
      </svg>
    );
  }

  if (mouthId === "mouth_03") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M115 75 Q190 120 265 75"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="8"
        />
        <path
          d="M115 75 Q105 80 98 70"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M265 75 Q275 80 282 70"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M155 122 Q190 135 225 122"
          fill="none"
          opacity="0.55"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    );
  }

  if (mouthId === "mouth_04") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M95 95 Q190 85 285 95"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="8"
        />
        <path
          d="M95 95 Q80 85 70 92"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M285 95 Q300 85 310 92"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M140 125 Q190 135 240 125"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
    );
  }

  if (mouthId === "mouth_05") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 380 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M115 105 Q190 55 265 105"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="8"
        />
        <path
          d="M115 105 Q105 112 95 104"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M265 105 Q275 112 285 104"
          fill="none"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M150 125 Q190 135 230 125"
          fill="none"
          opacity="0.6"
          stroke="#111"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 380 180"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M75 55 Q190 95 305 55 Q292 128 235 150 Q190 166 145 150 Q88 128 75 55 Z"
        fill="#fff"
        stroke="#111"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <path
        d="M75 55 Q190 95 305 55"
        fill="none"
        stroke="#111"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M75 55 Q60 60 55 45"
        fill="none"
        stroke="#111"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M305 55 Q320 60 325 45"
        fill="none"
        stroke="#111"
        strokeLinecap="round"
        strokeWidth="6"
      />
      <path
        d="M110 105 Q150 110 175 107"
        fill="none"
        stroke="#111"
        strokeLinecap="round"
        strokeWidth="4"
      />
      <path
        d="M205 107 Q230 110 270 105"
        fill="none"
        stroke="#111"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}
