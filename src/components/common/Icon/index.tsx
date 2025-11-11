import React from "react";
import { ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

// Import SVG icons using relative paths
import FriendsSvg from "../../assets/icons/friends.svg";
import HomeSvg from "../../assets/icons/home.svg";
import NotificationSvg from "../../assets/icons/notification.svg";
import PlusSvg from "../../assets/icons/plus.svg";
import ProfileSvg from "../../assets/icons/profile.svg";
import SearchSvg from "../../assets/icons/search.svg";

const icons = {
    home: HomeSvg,
    search: SearchSvg,
    plus: PlusSvg,
    friends: FriendsSvg,
    profile: ProfileSvg,
    notification: NotificationSvg,
} as const;

export type IconName = keyof typeof icons;

type Props = {
    name: IconName;
    size?: number;
    color?: string;
    style?: ViewStyle;
} & Omit<SvgProps, 'width' | 'height'>;

export default function Icon({ name, size = 24, color, style, ...svgProps }: Props) {
    const SvgComponent = icons[name];
    if (!SvgComponent) return null;

    return (
        <SvgComponent
            width={size}
            height={size}
            stroke={color}
            fill={color}
            style={style as any}
            {...svgProps}
        />
    );
}
