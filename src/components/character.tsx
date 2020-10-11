import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';
import {
  Surface,
  Title,
  Caption,
  Text,
  Avatar,
  TouchableRipple,
  useTheme,
  Card,
  Paragraph,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import color from 'color';

import {
  Thumbnail,
  Comics,
  Series,
  Stories,
  Events,
  Url,
} from '../types/characterTypes';

export type CharacterProps = {
  id: number;
  name: string;
  description: string;
  modified: string;
  thumbnail: Thumbnail;
  resourceURI: string;
  comics: Comics;
  series: Series;
  stories: Stories;
  events: Events;
  urls: Url[];
  onPress: (id: number) => void;
}

export const Character = (props: CharacterProps) => {
  const theme = useTheme();

  const iconColor = color(theme.colors.text)
    .alpha(0.54)
    .rgb()
    .string();

  const contentColor = color(theme.colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const imageBorderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const randomHexColor = () => {
    return '#000000'.replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
  };

  const [rippleColor, setRippleColor] = React.useState(randomHexColor());

  return (
    <TouchableRipple
      onPress={() => {
        setRippleColor(randomHexColor());
        // return props.onPress(props.id)
      }}
      background={TouchableNativeFeedback.Ripple(rippleColor, false)}
    >
      <Card style={styles.card}>
        <Avatar.Image
          style={[styles.cardCover, { borderColor: imageBorderColor }]}
          source={{
            uri: `${props.thumbnail.path}.${props.thumbnail.extension}`,
          }}
          size={styles.cardCover.width}
        />
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>
            {props.name.length > 18
              ? props.name.substring(0, 18 - 3) + '...'
              : props.name}
          </Title>
          <Paragraph
            style={[styles.paragraph, { color: contentColor }]}
          >{`#${props.id}`}</Paragraph>
        </Card.Content>
        <TouchableHighlight
          style={{
            borderRadius: 100,
            width: '75%',
            alignSelf: 'center',
            marginTop: 5,
          }}
          activeOpacity={0.8}
          underlayColor='#DDDDDD'
          onPress={() => props.onPress(props.id)}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name='account-search'
              size={20}
              color={iconColor}
            />
            <Caption style={styles.iconDescription}>Details</Caption>
          </View>
        </TouchableHighlight>
      </Card>
      {/* </Surface> */}
    </TouchableRipple>
  );
};

/*
<View style={styles.leftColumn}>
                    <Avatar.Image source={{ uri: `${props.thumbnail.path}.${props.thumbnail.extension}` }} size={30} />
                </View>
                <View style={styles.rightColumn}>
                    <View style={styles.topRow}>
                        <Title>{props.name}</Title>
                        <Caption style={styles.handle}>{props.handle}</Caption>
                        <Caption style={[styles.handle, styles.dot]}>{'\u2B24'}</Caption>
                        <Caption>{props.date}</Caption>
                    </View>
                    <Text style={{ color: contentColor }}>{props.content}</Text>
                    <Image
                        source={{ uri: props.image }}
                        style={[
                            styles.image,
                            {
                                borderColor: imageBorderColor,
                            },
                        ]}
                    />
                    <View style={styles.bottomRow}>
                        <TouchableOpacity
                            onPress={() => { }}
                            hitSlop={{ top: 10, bottom: 10 }}
                        >
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name="comment-outline"
                                    size={12}
                                    color={iconColor}
                                />
                                <Caption style={styles.iconDescription}>
                                    {props.comments}
                                </Caption>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { }}
                            hitSlop={{ top: 10, bottom: 10 }}
                        >
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name="share-outline"
                                    size={14}
                                    color={iconColor}
                                />
                                <Caption style={styles.iconDescription}>
                                    {props.retweets}
                                </Caption>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { }}
                            hitSlop={{ top: 10, bottom: 10 }}
                        >
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name="heart-outline"
                                    size={12}
                                    color={iconColor}
                                />
                                <Caption style={styles.iconDescription}>{props.hearts}</Caption>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

*/

const styles = StyleSheet.create({
  card: {
    margin: 5,
    width: 110,
    height: 225,
    flexDirection: 'column',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#f0141e',
    borderWidth: 0.3,
  },
  cardCover: {
    borderTopRightRadius: 75,
    borderTopLeftRadius: 75,
    borderBottomRightRadius: 75,
    borderBottomLeftRadius: 75,
    width: 75,
    height: 75,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardContent: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    lineHeight: 18,
    fontSize: 12,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 9,
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    // alignSelf: 'flex-end',
  },
  iconDescription: {
    marginTop: 2,
    lineHeight: 12,
  },
});
