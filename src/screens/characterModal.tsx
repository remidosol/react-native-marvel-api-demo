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
import { CharacterProps } from '../components/character';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import color from 'color';
import { ActionTypes, renderHeader } from '../components/ModalStackUtils';

export type CharacterScreenItemProps = CharacterProps[] &
  StackScreenProps<StackNavigatorParamList, 'Characters'>

interface characterSearchState {
  characters: CharacterProps[];
}

const characterReducer = (
  state: characterSearchState,
  action: { type: ActionTypes; data: CharacterProps[] }
) => {
  switch (action.type) {
    case ActionTypes.GET_CHARACTER_DATA:
      state = {
        ...state,
        characters: action.data as CharacterProps[],
      };
      break;
  }
  return state;
};

export const CharactersScreen = (props: CharacterScreenItemProps) => {
  const [characterState, characterDispatch] = React.useReducer(
    characterReducer,
    {
      characters: [...props.route.params],
    }
  );

  const [inputText, setInputText] = React.useState('');

  const randomHexColor = () => {
    return '#000000'.replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
  };

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

  const renderItem = ({ item }: { item: CharacterProps }) => {
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
              {item.name.length > 28
                ? item.name.substring(0, 28 - 3) + '...'
                : item.name}
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
                name='account-search'
                size={20}
                color={iconColor}
              />
              <Caption style={styles.iconDescription}>Details</Caption>
            </View>
          </TouchableHighlight>
        </Card.Content>
        {/* </Surface> */}
      </TouchableRipple>
    );
  };

  return props ? (
    <>
      {renderHeader(
        inputText,
        setInputText,
        props.route.params,
        characterDispatch,
        ActionTypes.GET_CHARACTER_DATA
      )}
      <FlatList
        contentContainerStyle={[
          styles.list,
          { backgroundColor: theme.colors.background },
        ]}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        data={characterState.characters}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id.toString()}
        ItemSeparatorComponent={() => (
          <View style={{ height: StyleSheet.hairlineWidth }} />
        )}
        //   columnWrapperStyle={styles.column}
        // disableVirtualization={true}
      />
    </>
  ) : (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text>There is no Character.</Text>
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
  },
  list: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
