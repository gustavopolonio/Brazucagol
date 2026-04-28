export type AvatarBodyOptionId =
  | "avatar_01"
  | "avatar_01_meia"
  | "avatar_01_meia_negro"
  | "avatar_01_negro"
  | "avatar_02"
  | "avatar_02_meia"
  | "avatar_02_meia_negro"
  | "avatar_02_negro";

export type AvatarBackgroundOptionId = "campo" | "vestiario";

export type AvatarBaseOptionId =
  | "avatar_01"
  | "avatar_01_negro"
  | "avatar_02"
  | "avatar_02_negro";

export type AvatarSockOptionId = "short" | "long";

export type AvatarHairOptionId = "none" | "hair_01" | "hair_02" | "hair_03";

export type AvatarEyebrowOptionId =
  | "eyebrow_01"
  | "eyebrow_02"
  | "eyebrow_03"
  | "eyebrow_04";

export type AvatarEyeOptionId =
  | "eye_01"
  | "eye_02"
  | "eye_03"
  | "eye_04"
  | "eye_05";

export type AvatarNoseOptionId = "nose_01" | "nose_02" | "nose_03";

export type AvatarMouthOptionId =
  | "mouth_01"
  | "mouth_02"
  | "mouth_03"
  | "mouth_04"
  | "mouth_05";

export type PlayerAvatarConfig = {
  backgroundId: AvatarBackgroundOptionId;
  bodyId: AvatarBodyOptionId;
  eyebrowColor: string;
  eyebrowId: AvatarEyebrowOptionId;
  eyeColor: string;
  eyeId: AvatarEyeOptionId;
  hairId: AvatarHairOptionId;
  mouthId: AvatarMouthOptionId;
  noseId: AvatarNoseOptionId;
};

export type AvatarImageOption<TId extends string> = {
  className?: string;
  id: TId;
  imageUrl?: string;
  label: string;
};

export type AvatarSockOption = {
  id: AvatarSockOptionId;
  label: string;
};

export type AvatarPartOption<TId extends string> = {
  id: TId;
  label: string;
};

export type AvatarLayerOption<TId extends string> = AvatarPartOption<TId> & {
  layerClassName: string;
};

export type AvatarLayerImageOption<TId extends string> =
  AvatarImageOption<TId> & {
    layerClassName: string;
  };

export const DEFAULT_PLAYER_AVATAR_CONFIG: PlayerAvatarConfig = {
  backgroundId: "campo",
  bodyId: "avatar_01",
  eyebrowColor: "#1b120d",
  eyebrowId: "eyebrow_01",
  eyeColor: "#48d6bf",
  eyeId: "eye_01",
  hairId: "hair_01",
  mouthId: "mouth_03",
  noseId: "nose_01",
};

export const AVATAR_BACKGROUND_OPTIONS: Array<
  AvatarImageOption<AvatarBackgroundOptionId>
> = [
  {
    id: "campo",
    imageUrl: "/images/profile/campo.png",
    label: "Campo",
  },
  {
    id: "vestiario",
    imageUrl: "/images/profile/vestiario.png",
    label: "Vestiário",
  },
];

export const AVATAR_BODY_OPTIONS: Array<AvatarImageOption<AvatarBodyOptionId>> =
  [
    {
      id: "avatar_01",
      imageUrl: "/images/profile/avatar_01.png",
      label: "Uniforme 1",
    },
    {
      id: "avatar_01_meia",
      imageUrl: "/images/profile/avatar_01_meia.png",
      label: "Uniforme 1 meia",
    },
    {
      id: "avatar_01_meia_negro",
      imageUrl: "/images/profile/avatar_01_meia_negro.png",
      label: "Uniforme 1 meia escura",
    },
    {
      className: "left-[2px]",
      id: "avatar_01_negro",
      imageUrl: "/images/profile/avatar_01_negro.png",
      label: "Uniforme 1 escuro",
    },
    {
      id: "avatar_02",
      imageUrl: "/images/profile/avatar_02.png",
      label: "Uniforme 2",
    },
    {
      id: "avatar_02_meia",
      imageUrl: "/images/profile/avatar_02_meia.png",
      label: "Uniforme 2 meia",
    },
    {
      id: "avatar_02_meia_negro",
      imageUrl: "/images/profile/avatar_02_meia_negro.png",
      label: "Uniforme 2 meia escura",
    },
    {
      id: "avatar_02_negro",
      imageUrl: "/images/profile/avatar_02_negro.png",
      label: "Uniforme 2 escuro",
    },
  ];

export const AVATAR_BASE_OPTIONS: Array<AvatarImageOption<AvatarBaseOptionId>> =
  [
    {
      id: "avatar_01",
      imageUrl: "/images/profile/avatar_01.png",
      label: "Avatar 1",
    },
    {
      id: "avatar_01_negro",
      imageUrl: "/images/profile/avatar_01_negro.png",
      label: "Avatar 2",
    },
    {
      id: "avatar_02",
      imageUrl: "/images/profile/avatar_02.png",
      label: "Avatar 3",
    },
    {
      id: "avatar_02_negro",
      imageUrl: "/images/profile/avatar_02_negro.png",
      label: "Avatar 4",
    },
  ];

export const AVATAR_SOCK_OPTIONS: AvatarSockOption[] = [
  {
    id: "short",
    label: "Meia longa",
  },
  {
    id: "long",
    label: "Meia curta",
  },
];

const avatarBodyIdsByBaseAndSocks: Record<
  AvatarBaseOptionId,
  Record<AvatarSockOptionId, AvatarBodyOptionId>
> = {
  avatar_01: {
    long: "avatar_01_meia",
    short: "avatar_01",
  },
  avatar_01_negro: {
    long: "avatar_01_meia_negro",
    short: "avatar_01_negro",
  },
  avatar_02: {
    long: "avatar_02_meia",
    short: "avatar_02",
  },
  avatar_02_negro: {
    long: "avatar_02_meia_negro",
    short: "avatar_02_negro",
  },
};

const avatarBaseIdsByBody: Record<AvatarBodyOptionId, AvatarBaseOptionId> = {
  avatar_01: "avatar_01",
  avatar_01_meia: "avatar_01",
  avatar_01_meia_negro: "avatar_01_negro",
  avatar_01_negro: "avatar_01_negro",
  avatar_02: "avatar_02",
  avatar_02_meia: "avatar_02",
  avatar_02_meia_negro: "avatar_02_negro",
  avatar_02_negro: "avatar_02_negro",
};

const avatarSockIdsByBody: Record<AvatarBodyOptionId, AvatarSockOptionId> = {
  avatar_01: "short",
  avatar_01_meia: "long",
  avatar_01_meia_negro: "long",
  avatar_01_negro: "short",
  avatar_02: "short",
  avatar_02_meia: "long",
  avatar_02_meia_negro: "long",
  avatar_02_negro: "short",
};

export const AVATAR_HAIR_OPTIONS: Array<
  AvatarLayerImageOption<AvatarHairOptionId>
> = [
  {
    id: "none",
    label: "Sem cabelo",
    layerClassName: "absolute inset-0 z-[7] h-auto w-[300px] object-contain",
  },
  {
    id: "hair_01",
    imageUrl: "/images/profile/hair_01.png",
    label: "Cabelo 1",
    layerClassName: "absolute inset-0 z-[7] h-auto w-[31%] left-[33.8%] top-[-1.4%] object-contain",
  },
  {
    id: "hair_02",
    imageUrl: "/images/profile/hair_02.png",
    label: "Cabelo 2",
    layerClassName: "absolute inset-0 z-[7] h-auto w-[34%] left-[31.6%] top-[2%] object-contain",
  },
  {
    id: "hair_03",
    imageUrl: "/images/profile/hair_03.png",
    label: "Cabelo 3",
    layerClassName: "absolute inset-0 z-[7] h-auto w-[38%] left-[30%] top-[2.5%] object-contain",
  },
];

export const AVATAR_EYEBROW_OPTIONS: Array<
  AvatarLayerOption<AvatarEyebrowOptionId>
> = [
  {
    id: "eyebrow_01",
    label: "Sobrancelha 1",
    layerClassName: "absolute left-[42%] top-[14.8%] z-[4] w-[15%]",
  },
  {
    id: "eyebrow_02",
    label: "Sobrancelha 2",
    layerClassName: "absolute left-[42.6%] top-[15.2%] z-[4] w-[13.8%]",
  },
  {
    id: "eyebrow_03",
    label: "Sobrancelha 3",
    layerClassName: "absolute left-[41.7%] top-[14.6%] z-[4] w-[15.6%]",
  },
  {
    id: "eyebrow_04",
    label: "Sobrancelha 4",
    layerClassName: "absolute left-[41%] top-[12.7%] z-[4] w-[17%]",
  },
];

export const AVATAR_EYE_OPTIONS: Array<AvatarLayerOption<AvatarEyeOptionId>> = [
  {
    id: "eye_01",
    label: "Olhos 1",
    layerClassName: "absolute w-[16%] left-[41.6%] top-[14.5%] z-[3]",
  },
  {
    id: "eye_02",
    label: "Olhos 2",
    layerClassName: "absolute w-[14%] left-[42.5%] top-[15%] z-[3]",
  },
  {
    id: "eye_03",
    label: "Olhos 3",
    layerClassName: "absolute w-[14%] left-[42.5%] top-[15%] z-[3]",
  },
  {
    id: "eye_04",
    label: "Olhos 4",
    layerClassName: "absolute w-[23%] left-[38%] top-[12.4%] z-[3]",
  },
  {
    id: "eye_05",
    label: "Olhos 5",
    layerClassName: "absolute w-[15%] left-[42%] top-[14.5%] z-[3]",
  },
];

export const AVATAR_NOSE_OPTIONS: Array<AvatarLayerOption<AvatarNoseOptionId>> =
  [
    {
      id: "nose_01",
      label: "Nariz 1",
      layerClassName: "absolute left-[43.6%] top-[17.6%] z-[5] w-[12%]",
    },
    {
      id: "nose_02",
      label: "Nariz 2",
      layerClassName: "absolute left-[43.6%] top-[17.6%] z-[5] w-[12%]",
    },
    {
      id: "nose_03",
      label: "Nariz 3",
      layerClassName: "absolute left-[46.8%] top-[19.6%] z-[5] w-[5.4%]",
    },
  ];

export const AVATAR_MOUTH_OPTIONS: Array<
  AvatarLayerOption<AvatarMouthOptionId>
> = [
  {
    id: "mouth_01",
    label: "Boca 1",
    layerClassName: "absolute left-[45.6%] top-[21%] z-[6] w-[8%]",
  },
  {
    id: "mouth_02",
    label: "Boca 2",
    layerClassName: "absolute left-[46%] top-[21.1%] z-[6] w-[7.2%]",
  },
  {
    id: "mouth_03",
    label: "Boca 3",
    layerClassName: "absolute left-[44.6%] top-[20.8%] z-[6] w-[10%]",
  },
  {
    id: "mouth_04",
    label: "Boca 4",
    layerClassName: "absolute left-[46.1%] top-[21.5%] z-[6] w-[7.1%]",
  },
  {
    id: "mouth_05",
    label: "Boca 5",
    layerClassName: "absolute left-[45.6%] top-[21.2%] z-[6] w-[8%]",
  },
];

export const EYE_COLOR_OPTIONS = [
  "#48d6bf",
  "#4a53ff",
  "#4aa3ff",
  "#43b05c",
  "#8b5a2b",
  "#f236ff",
  "#111111",
];

export const EYEBROW_COLOR_OPTIONS = [
  "#1b120d",
  "#111111",
  "#5a3324",
  "#8a5a35",
  "#d2a36f",
  "#e8e0c8",
  "#7c2d12",
];

const avatarBodyIds = new Set(AVATAR_BODY_OPTIONS.map((option) => option.id));
const avatarBackgroundIds = new Set(
  AVATAR_BACKGROUND_OPTIONS.map((option) => option.id),
);
const avatarHairIds = new Set(AVATAR_HAIR_OPTIONS.map((option) => option.id));
const avatarEyebrowIds = new Set(
  AVATAR_EYEBROW_OPTIONS.map((option) => option.id),
);
const avatarEyeIds = new Set(AVATAR_EYE_OPTIONS.map((option) => option.id));
const avatarNoseIds = new Set(AVATAR_NOSE_OPTIONS.map((option) => option.id));
const avatarMouthIds = new Set(AVATAR_MOUTH_OPTIONS.map((option) => option.id));

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

export function normalizePlayerAvatarConfig(
  value: unknown,
): PlayerAvatarConfig {
  if (!value || typeof value !== "object") {
    return DEFAULT_PLAYER_AVATAR_CONFIG;
  }

  const candidate = value as Partial<PlayerAvatarConfig>;

  return {
    backgroundId: avatarBackgroundIds.has(
      candidate.backgroundId as AvatarBackgroundOptionId,
    )
      ? (candidate.backgroundId as AvatarBackgroundOptionId)
      : DEFAULT_PLAYER_AVATAR_CONFIG.backgroundId,
    bodyId: avatarBodyIds.has(candidate.bodyId as AvatarBodyOptionId)
      ? (candidate.bodyId as AvatarBodyOptionId)
      : DEFAULT_PLAYER_AVATAR_CONFIG.bodyId,
    eyebrowColor: isHexColor(candidate.eyebrowColor)
      ? candidate.eyebrowColor
      : DEFAULT_PLAYER_AVATAR_CONFIG.eyebrowColor,
    eyebrowId: avatarEyebrowIds.has(
      candidate.eyebrowId as AvatarEyebrowOptionId,
    )
      ? (candidate.eyebrowId as AvatarEyebrowOptionId)
      : DEFAULT_PLAYER_AVATAR_CONFIG.eyebrowId,
    eyeColor: isHexColor(candidate.eyeColor)
      ? candidate.eyeColor
      : DEFAULT_PLAYER_AVATAR_CONFIG.eyeColor,
    eyeId: avatarEyeIds.has(candidate.eyeId as AvatarEyeOptionId)
      ? (candidate.eyeId as AvatarEyeOptionId)
      : DEFAULT_PLAYER_AVATAR_CONFIG.eyeId,
    hairId: avatarHairIds.has(candidate.hairId as AvatarHairOptionId)
      ? (candidate.hairId as AvatarHairOptionId)
      : DEFAULT_PLAYER_AVATAR_CONFIG.hairId,
    mouthId: avatarMouthIds.has(candidate.mouthId as AvatarMouthOptionId)
      ? (candidate.mouthId as AvatarMouthOptionId)
      : DEFAULT_PLAYER_AVATAR_CONFIG.mouthId,
    noseId: avatarNoseIds.has(candidate.noseId as AvatarNoseOptionId)
      ? (candidate.noseId as AvatarNoseOptionId)
      : DEFAULT_PLAYER_AVATAR_CONFIG.noseId,
  };
}

export function getAvatarBackgroundOption(
  backgroundId: AvatarBackgroundOptionId,
) {
  return (
    AVATAR_BACKGROUND_OPTIONS.find((option) => option.id === backgroundId) ??
    AVATAR_BACKGROUND_OPTIONS[0]
  );
}

export function getAvatarBodyOption(bodyId: AvatarBodyOptionId) {
  return (
    AVATAR_BODY_OPTIONS.find((option) => option.id === bodyId) ??
    AVATAR_BODY_OPTIONS[0]
  );
}

export function getAvatarBaseOptionId(bodyId: AvatarBodyOptionId) {
  return avatarBaseIdsByBody[bodyId];
}

export function getAvatarSockOptionId(bodyId: AvatarBodyOptionId) {
  return avatarSockIdsByBody[bodyId];
}

export function getAvatarBodyIdForBaseAndSocks(
  baseId: AvatarBaseOptionId,
  sockId: AvatarSockOptionId,
) {
  return avatarBodyIdsByBaseAndSocks[baseId][sockId];
}

export function getAvatarHairOption(hairId: AvatarHairOptionId) {
  return (
    AVATAR_HAIR_OPTIONS.find((option) => option.id === hairId) ??
    AVATAR_HAIR_OPTIONS[0]
  );
}

export function getAvatarEyebrowOption(eyebrowId: AvatarEyebrowOptionId) {
  return (
    AVATAR_EYEBROW_OPTIONS.find((option) => option.id === eyebrowId) ??
    AVATAR_EYEBROW_OPTIONS[0]
  );
}

export function getAvatarEyeOption(eyeId: AvatarEyeOptionId) {
  return (
    AVATAR_EYE_OPTIONS.find((option) => option.id === eyeId) ??
    AVATAR_EYE_OPTIONS[0]
  );
}

export function getAvatarNoseOption(noseId: AvatarNoseOptionId) {
  return (
    AVATAR_NOSE_OPTIONS.find((option) => option.id === noseId) ??
    AVATAR_NOSE_OPTIONS[0]
  );
}

export function getAvatarMouthOption(mouthId: AvatarMouthOptionId) {
  return (
    AVATAR_MOUTH_OPTIONS.find((option) => option.id === mouthId) ??
    AVATAR_MOUTH_OPTIONS[0]
  );
}
