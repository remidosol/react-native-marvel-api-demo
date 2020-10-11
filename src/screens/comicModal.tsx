import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableNativeFeedback,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import {
  Avatar,
  TouchableRipple,
  useTheme,
  Card,
  Title,
  Paragraph,
  Caption,
} from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { StackNavigatorParamList } from '../types';
import { ComicProps } from '../components/comic';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import color from 'color';

import { ActionTypes, renderHeader } from '../components/ModalStackUtils';

export type ComicScreenItemProps = ComicProps[] &
  StackScreenProps<StackNavigatorParamList, 'Comics'>

interface comicSearchState {
  comics: ComicProps[];
}

const comicReducer = (
  state: comicSearchState,
  action: { type: ActionTypes; data: ComicProps[] }
) => {
  switch (action.type) {
    case ActionTypes.GET_COMIC_DATA:
      state = {
        ...state,
        comics: action.data as ComicProps[],
      };
      break;
  }
  return state;
};

export const ComicsScreen = (props: ComicScreenItemProps) => {
  const randomHexColor = () => {
    return '#000000'.replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
  };

  const [comicState, comicDispatch] = React.useReducer(comicReducer, {
    comics: [...props.route.params],
  });
  const [inputText, setInputText] = React.useState('');

  const [rippleColor, setRippleColor] = React.useState(randomHexColor());

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

  const renderItem = ({ item }: { item: ComicProps }) => {
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
          {item.thumbnail.path ? (
            <Avatar.Image
              style={[styles.avatar, { borderColor: imageBorderColor }]}
              source={{
                uri: `${item.thumbnail.path}.${item.thumbnail.extension}`,
              }}
              size={styles.avatar.width}
            />
          ) : (
            <Avatar.Text
              style={{
                backgroundColor: '#d30000',
                marginHorizontal: styles.avatar.marginHorizontal,
              }}
              size={styles.avatar.width}
              label='Hero'
              labelStyle={{ fontSize: 15 }}
            />
          )}

          <Card.Content style={styles.cardContent}>
            <Title style={styles.title}>
              {item.title.length > 28
                ? item.title.substring(0, 28 - 3) + '...'
                : item.title}
            </Title>
            <Paragraph
              style={[styles.paragraph, { color: contentColor }]}
            >{`#${item.id}`}</Paragraph>
          </Card.Content>
          <TouchableHighlight
            style={{
              borderRadius: 100,
              //   flexDirection: 'row',
              //   justifyContent: 'flex-end',
              //   alignSelf: 'flex-end',
              //   alignItems: 'flex-end',
            }}
            activeOpacity={0.8}
            underlayColor='#DDDDDD'
            onPress={() => item.onPress(item.id)}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name='book-search'
                size={20}
                color={iconColor}
              />
              <Caption style={styles.iconDescription}>Details</Caption>
            </View>
          </TouchableHighlight>
        </Card.Content>
      </TouchableRipple>
    );
  };

  return comicState.comics !== [] ? (
    <>
      {renderHeader(
        inputText,
        setInputText,
        props.route.params,
        comicDispatch,
        ActionTypes.GET_COMIC_DATA
      )}
      <FlatList
        //   ListHeaderComponent={}
        contentContainerStyle={[
          styles.list,
          { backgroundColor: theme.colors.background },
        ]}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        data={comicState.comics}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => (
          <View style={{ height: StyleSheet.hairlineWidth }} />
        )}
        disableVirtualization={true}
      />
    </>
  ) : (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text>There is no Comic.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
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
  itemContainer: {
    flex: 0.001,
    margin: 5,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 6,
    flexDirection: 'row',
    // padding: 10,
    justifyContent: 'space-around',
    // alignSelf: 'center',
    alignItems: 'center',

    elevation: 2,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderBottomEndRadius: Dimensions.get('window').width / 7,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: 15,
    // marginBottom: 10,

    // height: Dimensions.get('window').height,
  },
  list: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
});
