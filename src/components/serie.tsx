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
  Characters,
  Comics,
  Creators,
  Events,
  Stories,
  Thumbnail,
  Url,
} from '../types/seriesType';

export type SerieProps = {
  id: number;
  title: string;
  description?: string;
  resourceURI: string;
  urls: Url[];
  startYear: number;
  endYear: number;
  rating: string;
  type: string;
  modified: string;
  thumbnail: Thumbnail;
  creators: Creators;
  characters: Characters;
  stories: Stories;
  comics: Comics;
  events: Events;
  next?: any;
  previous?: any;
  onPress: (id: number) => void;
}

export const Serie = (props: SerieProps) => {
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
        {/*<Card.Title title="Card Title" subtitle="Card Subtitle" /> borderTopRightRadius: 75, borderTopLeftRadius: 75, borderBottomRightRadius: 75, borderBottomLeftRadius: 75,*/}
        <Avatar.Image
          style={[styles.cardCover, { borderColor: imageBorderColor }]}
          source={{
            uri: `${props.thumbnail.path}.${props.thumbnail.extension}`,
          }}
          size={styles.cardCover.width}
        />
        {/* <Card.Cover
                        style={styles.cardCover}
                        source={{ uri: `${props.thumbnail.path}.${props.thumbnail.path}` }}
                    /> */}
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>
            {props.title.length > 18
              ? props.title.substring(0, 18 - 3) + '...'
              : props.title}
            {/* {props.title} */}
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
              name='file-document-box-search'
              size={20}
              color={iconColor}
            />
            <Caption style={styles.iconDescription}>Details</Caption>
          </View>
        </TouchableHighlight>
      </Card>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
    width: 110,
    height: 225,
    flexDirection: 'column',
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'yellow',
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
  },
  iconDescription: {
    marginTop: 2,
    lineHeight: 12,
  },
});
