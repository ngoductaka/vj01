import React, { useState, useEffect, useRef } from 'react'
import { FlatList } from 'react-native';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    Animated,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    ScrollView,
    ImageBackground
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { COLOR } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';
import { images } from '../../utils/images';
import { Icon } from 'native-base';
import SQLite from 'react-native-sqlite-storage';

const { width, height } = Dimensions.get('window');

let db;

const WhoIsMillionaire = (props) => {

    const { navigation } = props;
    const ref = useRef();
    const [step, setStep] = useState(0);

    const success = () => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM user', [], (tx, results) => {  // sql query to get all table data and storing it in 'results' variable
                let data = results.rows.length;
                let users = [];    //creating empty array to store the rows of the sql table data

                for (let i = 0; i < results.rows.length; i++) {
                    users.push(results.rows.item(i));                   //looping through each row in the table and storing it as object in the 'users' array
                }

                this.setState({ userList: users });         //setting the state(userlist) with users array which has all the table data
            });
        });
        // alert("ok")
    }

    const fail = (error) => {
        console.error(error) // logging out error if there is one
    }

    useEffect(() => {
        db = SQLite.openDatabase(
            {
                name: 'user.db',
                createFromLocation: 1,
            },
            (success) => {
                console.log('success', success);
                db.transaction(tx => {
                    console.log('trans', tx);
                    tx.executeSql("SELECT * FROM millionaire WHERE id = 1", [], (tx, results) => {  // sql query to get all table data and storing it in 'results' variable
                        console.log('-as-a-s-as', results);
                          let data = results.rows.length;                          
                          let users = [];    //creating empty array to store the rows of the sql table data

                          for (let i = 0; i < results.rows.length; i++) {
                            users.push(results.rows.item(i));                   //looping through each row in the table and storing it as object in the 'users' array
                          }

                        //    this.setState({ userList:users});         //setting the state(userlist) with users array which has all the table data
                    });
                });
            },
            (err) => {
                console.log('----', err);
            }
        );

    }, []);


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ImageBackground source={images.milionBg} style={{ width, height, }}>
                {step == 0 &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Animatable.View animation='slideInLeft' duration={1200}>
                            <LinearGradient style={{ overflow: 'hidden', borderRadius: 30 }} colors={['#23308E', '#1D72D9', '#23308E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                <TouchableOpacity onPress={() => setStep(2)} style={styles.btn}>
                                    <Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 20 }}>BẮT ĐẦU</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Animatable.View>
                        <Animatable.View animation='slideInRight' duration={1200}>
                            <LinearGradient style={{ overflow: 'hidden', borderRadius: 30, marginTop: 16 }} colors={['#23308E', '#1D72D9', '#23308E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                <TouchableOpacity onPress={() => setStep(1)} style={styles.btn}>
                                    <Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 20 }}>HƯỚNG DẪN</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Animatable.View>
                        <Animatable.View animation='slideInLeft' duration={1200}>
                            <LinearGradient style={{ overflow: 'hidden', borderRadius: 30, marginTop: 16 }} colors={['#23308E', '#1D72D9', '#23308E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
                                    <Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Bold }), fontSize: 20 }}>GAME KHÁC</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Animatable.View>
                    </View>
                }
                {step == 1 &&
                    <SafeAreaView style={{ flex: 1 }}>
                        <Animatable.View animation='fadeIn' style={{ flex: 1, paddingHorizontal: 20 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => setStep(0)} style={{ paddingVertical: 10, paddingRight: 10 }}>
                                    <Icon name='arrow-back' style={{ fontSize: 25, color: COLOR.MAIN }} />
                                </TouchableOpacity>
                                <Text style={{ color: 'yellow', fontSize: 22, ...fontMaker({ weight: fontStyles.SemiBold }) }}>Hướng dẫn cách chơi</Text>
                            </View>
                            <Text style={{ color: 'white', fontSize: 15, ...fontMaker({ weight: fontStyles.Regular }) }}>Người chơi sẽ lần lượt vượt qua 15 câu hỏi của chương trình. Người thắng cuộc là người trả lời được câu hỏi số 15. Bạn sẽ có 3 sự trợ giúp:</Text>
                        </Animatable.View>
                    </SafeAreaView>
                }
                {step == 2 &&
                    <SafeAreaView style={{ flex: 1, }}>
                        <View style={{ flex: 1, padding: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TouchableOpacity>
                                    <Text style={{ color: 'white' }}>Help1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={{ color: 'white' }}>Help2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Text style={{ color: 'white' }}>Help3</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, padding: 10 }}>
                                <LinearGradient style={{ overflow: 'hidden', borderRadius: 12, padding: 12, marginTop: 16 }} colors={['#244196', '#1DAFED', '#244196']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                                    <View style={{ width: '100%', minHeight: height / 6, justifyContent: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: 16, }}>Đảng Cộng sản Việt Nam là đảng cầm quyền và là chính đảng duy nhất được  Chủ nghĩa Marx-Lenin và Tư tưởng Hồ Chí Minh làm kim chỉ nam cho mọi hoạt động nói về Đảng Cộng sản Việt Nam.</Text>
                                    </View>

                                </LinearGradient>
                                <View style={{ flex: 1 }}>
                                    {[1, 2, 3, 4].map((item, index) => {
                                        return (
                                            <AnswerOption
                                                key={index + 'answer'}
                                                index={index}
                                            />
                                        )
                                    })}
                                </View>
                                <TouchableOpacity onPress={() => setStep(0)} style={{ alignSelf: 'flex-end' }}>
                                    <Icon name='exit' style={{ fontSize: 32, color: 'red' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                }
            </ImageBackground>
        </View >
    )
}

export default WhoIsMillionaire;

const AnswerOption = ({ index }) => {
    return (
        <Animatable.View animation={index % 2 ? 'slideInLeft' : 'slideInRight'} duration={1200}>
            <LinearGradient style={{ overflow: 'hidden', borderRadius: 30, marginTop: 20 }} colors={['#23308E', '#1D72D9', '#23308E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <TouchableOpacity onPress={() => setStep(2)} style={[styles.option]}>
                    <Text style={{ color: 'white', ...fontMaker({ weight: fontStyles.Regular }), fontSize: 18 }}>A. Option1</Text>
                </TouchableOpacity>
            </LinearGradient>
        </Animatable.View>
    );
}

const styles = StyleSheet.create({
    btn: {
        padding: 8, borderRadius: 30, borderWidth: 1, borderColor: 'white', width: 240, justifyContent: 'center', alignItems: 'center'
    },
    option: {
        padding: 8, borderRadius: 30, borderWidth: 1, borderColor: 'white', width: '100%', justifyContent: 'center',
        paddingHorizontal: 20
    }
});