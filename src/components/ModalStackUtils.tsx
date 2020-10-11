import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableNativeFeedback,
  FlatList,
} from 'react-native';
import {
  Avatar,
  TouchableRipple,
  Searchbar,
  Card,
  Paragraph,
  useTheme,
  Title,
} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { StoryItem, ComicsSeriesEventsItem } from './../types/characterTypes';
import { CreatorItem } from './../types/comicTypes';
import color from 'color';
import { StackScreenProps } from '@react-navigation/stack';
import { StackNavigatorParamList } from '../types';

export enum ActionTypes {
  REQUEST_START = 'REQUEST_START',
  GET_CHARACTER_DATA = 'GET_CHARACTER_DATA',
  GET_COMIC_DATA = 'GET_COMIC_DATA',
  GET_SERIE_DATA = 'GET_SERIE_DATA',
}

export type StoryScreenProps = StoryItem[] &
  StackScreenProps<StackNavigatorParamList, 'Stories'>

export type EventScreenProps = ComicsSeriesEventsItem[] &
  StackScreenProps<StackNavigatorParamList, 'Events'>

export type CreatorScreenProps = CreatorItem[] &
  StackScreenProps<StackNavigatorParamList, 'Creators'>

const searchFilter = (
  text: string,
  params: any[],
  dispatch: Function,
  type: ActionTypes
) => {
  const newData = params.filter((item) => {
    const listItem = `${item.title.toLowerCase()}`;
    return listItem.indexOf(text.toLowerCase()) > -1;
  });

  dispatch({
    type: type,
    data: [...newData],
  });
};

export const renderHeader = (
  inputText: string,
  setInputText: Function,
  params: any[],
  dispatch: Function,
  type: ActionTypes
) => {
  return (
    <Searchbar
      value={inputText}
      onIconPress={() => {}}
      onKeyPress={() => {}}
      onChangeText={(text) => {
        setInputText(text);
        searchFilter(text, params, dispatch, type);
      }}
      style={styles.searchContainer}
      placeholder='Search something...'
      inputStyle={styles.inputContainer}
    />
  );
};

export const StoriesScreen = (props: StoryScreenProps) => {
  const randomHexColor = () => {
    return '#000000'.replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
  };

  const [rippleColor, setRippleColor] = React.useState(randomHexColor());

  const [stories, setStories] = React.useState<StoryItem[]>([
    ...props.route.params,
  ]);

  //   React.useEffect(() => {
  //     setStories([...props])
  //   })

  const theme = useTheme();

  const contentColor = color(theme.colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const imageBorderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const renderItem = ({ item }: { item: StoryItem }) => {
    return (
      <TouchableRipple
        onPress={() => {
          setRippleColor(randomHexColor());
          //   return item.onPress(item.id)
        }}
        background={TouchableNativeFeedback.Ripple(rippleColor, false)}
        // style={styles.itemContainer}
      >
        <Card.Content style={styles.itemContainer}>
          <Avatar.Text
            style={[
              styles.avatar,
              {
                backgroundColor: '#d30000',
                marginHorizontal: styles.avatar.marginHorizontal,
                borderColor: imageBorderColor,
              },
            ]}
            size={styles.avatar.width}
            label='Stories'
            labelStyle={{ fontSize: 12, fontWeight: 'bold' }}
          />

          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>
              {item.name.length > 28
                ? item.name.substring(0, 28 - 3) + '...'
                : item.name}
            </Title>
            <Paragraph
              style={[styles.paragraph, { color: contentColor }]}
            >{`Type: ${item.type}`}</Paragraph>
          </Card.Content>
        </Card.Content>
      </TouchableRipple>
    );
  };

  return props.route.params[0] ? (
    <FlatList
      renderItem={renderItem}
      data={stories}
      contentContainerStyle={[
        styles.list,
        { backgroundColor: theme.colors.background },
      ]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyExtractor={(item) => item.resourceURI.toString()}
    />
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>There is no Story.</Text>
    </View>
  );
};

export const EventsScreen = (props: EventScreenProps) => {
  const theme = useTheme();
  const randomHexColor = () => {
    return '#000000'.replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
  };

  const [rippleColor, setRippleColor] = React.useState(randomHexColor());
  const [events, setEvents] = React.useState<ComicsSeriesEventsItem[]>([
    ...props.route.params,
  ]);

  const imageBorderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const renderItem = ({ item }: { item: ComicsSeriesEventsItem }) => {
    return (
      <TouchableRipple
        onPress={() => {
          setRippleColor(randomHexColor());
          //   return item.onPress(item.id)
        }}
        background={TouchableNativeFeedback.Ripple(rippleColor, false)}
        // style={styles.itemContainer}
      >
        <Card.Content style={styles.itemContainer}>
          <Avatar.Text
            style={[
              styles.avatar,
              {
                backgroundColor: '#d30000',
                marginHorizontal: styles.avatar.marginHorizontal,
                borderColor: imageBorderColor,
              },
            ]}
            size={styles.avatar.width}
            label='Event'
            labelStyle={{ fontSize: 12, fontWeight: 'bold' }}
          />

          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>
              {item.name.length > 28
                ? item.name.substring(0, 28 - 3) + '...'
                : item.name}
            </Title>
          </Card.Content>
        </Card.Content>
      </TouchableRipple>
    );
  };

  return props.route.params[0] ? (
    <FlatList
      renderItem={renderItem}
      data={events}
      contentContainerStyle={[
        styles.list,
        { backgroundColor: theme.colors.background },
      ]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyExtractor={(item) => item.resourceURI.toString()}
    />
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>There is no Event.</Text>
    </View>
  );
};

export const CreatorsScreen = (props: CreatorScreenProps) => {
  const randomHexColor = () => {
    return '#000000'.replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
  };

  const [rippleColor, setRippleColor] = React.useState(randomHexColor());

  const theme = useTheme();

  const contentColor = color(theme.colors.text)
    .alpha(0.8)
    .rgb()
    .string();

  const [creators, setCreators] = React.useState<CreatorItem[]>([
    ...props.route.params,
  ]);

  const imageBorderColor = color(theme.colors.text)
    .alpha(0.15)
    .rgb()
    .string();

  const renderItem = ({ item }: { item: CreatorItem }) => {
    return (
      <TouchableRipple
        onPress={() => {
          setRippleColor(randomHexColor());
          //   return item.onPress(item.id)
        }}
        background={TouchableNativeFeedback.Ripple(rippleColor, false)}
        // style={styles.itemContainer}
      >
        <Card.Content style={styles.itemContainer}>
          <Avatar.Text
            style={{
              backgroundColor: '#d30000',
              marginHorizontal: styles.avatar.marginHorizontal,
            }}
            size={styles.avatar.width}
            label='Creators'
            labelStyle={{ fontSize: 15 }}
          />

          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>
              {item.name.length > 28
                ? item.name.substring(0, 28 - 3) + '...'
                : item.name}
            </Title>
            <Paragraph
              style={[styles.paragraph, { color: contentColor }]}
            >{`Role: ${item.role}`}</Paragraph>
          </Card.Content>
        </Card.Content>
      </TouchableRipple>
    );
  };

  return props.route.params[0] ? (
    <FlatList
      renderItem={renderItem}
      data={creators}
      contentContainerStyle={[
        styles.list,
        { backgroundColor: theme.colors.background },
      ]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyExtractor={(item) => item.resourceURI.toString()}
    />
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>There is no Creator.</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  card: {
    margin: 5,
    width: Dimensions.get('window').width,
    // height: 225,
    flexDirection: 'row',

    elevation: 3,

    borderColor: '#f0141e',
    borderWidth: 0.3,
  },
  cardCover: {
    resizeMode: 'cover',
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardContent: {
    // flex: 0.3,
    // margin: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
  avatar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    resizeMode: 'cover',
    width: 85,
    marginHorizontal: 5,
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'flex-end',
    paddingHorizontal: 15,
  },
  iconDescription: {
    marginTop: 2,
    lineHeight: 12,
  },
  cardTitle: {
    marginTop: 10,
    marginBottom: 5,
  },
  itemContainer: {
    flex: 0.001,
    margin: 5,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 6,
    flexDirection: 'row',
    // padding: 10,
    justifyContent: 'space-between',
    // alignSelf: 'center',
    alignItems: 'center',

    elevation: 2,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderBottomEndRadius: Dimensions.get('window').width / 7,
  },

  textContainer: {
    fontSize: 12,
    justifyContent: 'space-around',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 15,
    // height: Dimensions.get('window').height,
  },
  list: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  searchContainer: {
    width: Dimensions.get('window').width - 20,
    padding: 5,
    margin: 10,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    fontSize: 16,
  },
});
