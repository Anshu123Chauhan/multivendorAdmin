import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font, PDFViewer, Link } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Worker, Viewer } from '@react-pdf-viewer/core';


// Define styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        position: 'relative'
    },
    firstPageBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#5b5f62',
    },
    firstPageTopRoundOne: {
        position: 'absolute',
        top: '-200px',
        left: '-520px',
        width: '700px',
        height: '700px',
        borderRadius: '100%',
        border: '4px solid #728478'
    },
    firstPageTopRoundTwo: {
        position: 'absolute',
        top: '-300px',
        left: '-500px',
        width: '700px',
        height: '700px',
        borderRadius: '100%',
        border: '2.5px solid #728478'
    },
    firstPageTopRoundThree: {
        position: 'absolute',
        top: '-270px',
        left: '-600px',
        width: '750px',
        height: '750px',
        borderRadius: '100%',
        // backgroundColor:'blue',
        border: '2px solid #728478'
    },
    firstPageUpperLeftContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '65%',
        height: '70%',
        backgroundColor: '#e4d0c5',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    firstPageMainImageContainer: {
        height: '85%',
        width: '85%',
        border: '10px solid white'
    },
    firstPageMainImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    logoImageContainer: {
        position: 'relative',
        top: '10%',
        left: '80%',
        width: '20%',
        height: '8%',
        backgroundColor: '#e4d0c5',
        padding: '2px',
    },
    logoImage: {
        width: '70%',
        height: 'auto',
        objectFit: 'cover',
        marginLeft: '15%'
    },
    firstPageUpperContainer: {
        position: 'absolute',
        top: 0,
        right: '10%',
        backgroundColor: '#f8d4c1',
        width: '60%',
        height: '10%',
    },
    firstPageTopLine: {
        height: '1px',
        backgroundColor: 'black',
        width: '80%',
        position: 'absolute',
        top: '10%',
        left: '10%',
    },

    firstPageContentBox: {
        position: 'absolute',
        bottom: '10%',
        left: '10%',
        width: '80%',
        height: '30%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-evenly",
        alignItems: 'left',
        margin: 'auto',

    },
    greetingContainer: {
        position: 'absolute',
        left: '40%',
        top: '20%',
        backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px 80px 10px 10px'

    },

    greeting: {
        fontSize: 35,
        fontWeight: 'bold'
    },
    customerNameContainer: {
        position: 'absolute',
        left: '40%',
        top: '28%',
        backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px 10px 10px 10px'
    },
    customerName: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    customerMessageContainer: {
        position: 'absolute',
        left: '10%',
        top: '75%',
        color: 'white',
        width: '35%',
        height: '20%',
    },
    customerMessage: {
        fontSize: 15,
    },
    firstPageBottomRightContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#728478',
        width: '50%',
        height: '35%',
    },
    firstPageBottomShapeContainer: {
        // position: 'absolute',
        // bottom: '-110px',
        // right: '-60px',
        // width: '50%',
        // height: '40%',
        position: 'absolute',
        bottom: '-80px',
        right: '-150px',
        width: '70%',
        height: '25%',
        transform: 'rotate(180deg)',

    },
    firstPageBottomRoundOne: {
        position: 'absolute',
        bottom: '-260px',
        right: '-350px',
        width: '500px',
        height: '500px',
        borderRadius: '100%',
        border: '5px solid #e7d3c5'
    },
    firstPageBottomRoundTwo: {
        position: 'absolute',
        bottom: '-460px',
        right: '-390px',
        width: '700px',
        height: '700px',
        borderRadius: '100%',
        border: '2px solid #e7d3c5'
    },
    // For Second Page =>

    secondPageBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#efe6dc',
    },
    secondPageTopContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80%',
        height: '60%',
        backgroundColor: '#728478',
    },
    secondPageImageContainer: {
        position: 'relative',
        left: '10%',
        top: '10%',
        width: '60%',
        height: '60%',
        border: '10px solid #efe6dc'

    },
    secondPageImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    secondPageProductPriceContainer: {
        position: 'absolute',
        right: '5%',
        top: '30%',
        backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px'

    },

    secondPageProductPrice: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    secondPageBottomContentContainer: {
        position: 'absolute',
        top: '72%',
        left: '10%',
        width: '50%',
        height: '25%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    secondPageProductName: {
        fontSize: 35,
    },
    secondPageProdutDescription: {
        fontSize: 15,
    },
    secondPageBottomRoundOne: {
        position: 'absolute',
        top: '-350px',
        left: '-500px',
        width: '1100px',
        height: '1100px',
        borderRadius: '100%',
        border: '5px solid #e7d3c5'
    },
    secondPageBottomRoundTwo: {
        position: 'absolute',
        top: '-350px',
        left: '-100px',
        width: '900px',
        height: '900px',
        borderRadius: '100%',
        border: '2px solid #e7d3c5'
    },
    secondPageTopUpperContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '50%',
        height: '30%',
        backgroundColor: '#5b6066'

    },


    // For third Page =>
    thirdPageLeftBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '40%',
        height: '100%',
        backgroundColor: '#efe6dc',
    },
    thirdPageRightBackground: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60%',
        height: '100%',
        backgroundColor: '#c4ad95',
    },
    thirdPageImageContainer: {
        position: 'relative',
        left: '50%',
        top: '10%',
        width: '40%',
        height: '50%',
        border: '10px solid #efe6dc'
    },
    thirdPageImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    thirdPageProductPriceContainer: {
        position: 'absolute',
        left: '10%',
        top: '30%',
        backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px'
    },
    thirdPageProductPrice: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    thirdPageBottomContentContainer: {
        position: 'absolute',
        top: '65%',
        left: '10%',
        width: '60%',
        height: '30%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    thirdPageProductName: {
        fontSize: 35,
    },
    thirdPageProdutDescription: {
        fontSize: 15,
    },
    thirdPageBottomRoundOne: {
        position: 'absolute',
        bottom: '-350px',
        right: '-670px',
        width: '1100px',
        height: '1100px',
        borderRadius: '100%',
        border: '2px solid #728478'

    },
    thirdPageBottomRoundTwo: {
        position: 'absolute',
        bottom: '-400px',
        right: '-2000px',
        width: '2200px',
        height: '2200px',
        borderRadius: '100%',
        border: '5px solid #728478'
    },
    thirdPageBottomShapeContainer: {
        position: 'absolute',
        bottom: '-250px',
        left: '25%',
        width: '50%',
        height: '40%',
        transform: 'rotate(70deg)',
    },

    // For fourth Page =>
    fourthPageTopBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: '#efe6dc',
    },
    fourthPageBottomBackground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: '#c4ad95',
    },
    fourthPageImageContainer: {
        position: 'relative',
        left: '10%',
        top: '10%',
        width: '92%',
        height: '50%',
        border: '10px solid #efe6dc'
    },
    fourthPageImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    fourthPageProductPriceContainer: {
        position: 'absolute',
        left: '10%',
        top: '20%',
        backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px'
    },
    fourthPageProductNameContainer: {
        position: 'absolute',
        left: '10%',
        top: '30%',
        backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px'
    },
    fourthPageProductPrice: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    fourthPageProdutDescriptionContainer: {
        position: 'absolute',
        top: '65%',
        left: '10%',
        width: '80%',
        height: '30%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    fourthPageProductName: {
        fontSize: 35,
    },
    fourthPageProdutDescription: {
        fontSize: 15,
    },
    fourthPageTopRoundOne: {
        position: 'absolute',
        top: '-400px',
        right: '-750px',
        width: '900px',
        height: '1000px',
        borderRadius: '100%',
        border: '5px solid #e7d3c5'
    },
    fourthPageTopRoundTwo: {
        position: 'absolute',
        top: '-450px',
        right: '-650px',
        width: '900px',
        height: '950px',
        borderRadius: '100%',
        border: '2px solid #e7d3c5'
    },
    fourthPageBottomRoundOne: {
        position: 'absolute',
        bottom: '-350px',
        left: '-670px',
        width: '1100px',
        height: '1100px',
        borderRadius: '100%',
        border: '2px solid #728478',
    },
    fourthPageBottomRoundTwo: {
        position: 'absolute',
        bottom: '-300px',
        left: '-250px',
        width: '700px',
        height: '600px',
        borderRadius: '100%',
        border: '5px solid #728478',
    },
    fourthPageBottomShapeContainer: {
        position: 'absolute',
        bottom: '-200px',
        left: '-100px',
        width: '50%',
        height: '40%',
        transform: 'rotate(70deg)',
    },

    // For Fifth Page =>
    fifthPageBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#efe6dc',
    },
    fifthPageRightBackground: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '45%',
        height: '70%',
        backgroundColor: '#728478',
    },
    fifthPageImageContainer: {
        position: 'relative',
        left: 0,
        top: '50%',
        width: '90%',
        height: '40%',
        border: '10px solid #efe6dc'
    },
    fifthPageImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    fifthPageProductPriceContainer: {
        position: 'absolute',
        top: '10%',
        right: '25%',
        backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px'
    },
    fifthPageProductPrice: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    fifthPageContentContainer: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '40%',
        height: '30%',
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    fifthPageProductName: {
        fontSize: 35,
    },
    fifthPageProdutDescription: {
        fontSize: 15,
    },
    fifthPageTopRoundOne: {
        position: 'absolute',
        top: '-400px',
        right: '-750px',
        width: '900px',
        height: '1000px',
        borderRadius: '100%',
        border: '5px solid #e7d3c5'
    },
    fifthPageTopRoundTwo: {
        position: 'absolute',
        top: '-450px',
        right: '-650px',
        width: '900px',
        height: '950px',
        borderRadius: '100%',
        border: '2px solid #e7d3c5'
    },
    fifthPageTopShapeContainer: {
        position: 'absolute',
        top: '-150px',
        right: '-120px',
        width: '50%',
        height: '40%',
        transform: 'rotate(120deg)',
    },


    // For sixth Page =>
    sixthPageTopBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: '#dfcdc1',
    },
    sixthPageBottomBackground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: '#eae7dc',
    },
    sixthPageImageContainer: {
        position: 'relative',
        left: '10%',
        top: '10%',
        width: '50%',
        height: '70%',
        border: '10px solid #efe6dc'
    },
    sixthPageImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    sixthPageProductPriceContainer: {
        position: 'absolute',
        left: '45%',
        top: '50%',
        backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px'
    },
    sixthPageProductNameContainer: {
        position: 'absolute',
        left: '45%',
        top: '60%',
        backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px',
        width: '50%',
    },
    sixthPageProductPrice: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    sixthPageProdutDescriptionContainer: {
        position: 'absolute',
        top: '20%',
        left: '65%',
        width: '30%',
        // height: '10%',
        display: 'flex',
        justifyContent: 'center',

    },
    sixthPageProductName: {
        fontSize: 35,
    },
    sixthPageProdutDescription: {
        fontSize: 15,
    },
    sixthPageTopRoundOne: {
        position: 'absolute',
        top: '-400px',
        right: '-750px',
        width: '900px',
        height: '1000px',
        borderRadius: '100%',
        border: '5px solid #e7d3c5'
    },
    sixthPageTopRoundTwo: {
        position: 'absolute',
        top: '-450px',
        right: '-650px',
        width: '900px',
        height: '950px',
        borderRadius: '100%',
        border: '2px solid #e7d3c5'
    },
    sixthPageBottomRoundOne: {
        position: 'absolute',
        bottom: '-150px',
        left: '-300px',
        width: '600px',
        height: '600px',
        borderRadius: '100%',
        border: '2px solid #728478',
    },

    sixthPageBottomRoundTwo: {
        position: 'absolute',
        bottom: '0px',
        left: '-350px',
        width: '500px',
        height: '500px',
        borderRadius: '100%',
        border: '5px solid #728478',
    },
    sixthPageBottomShapeContainer: {
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        width: '80%',
        height: '30%',
        // transform: 'rotate(80deg)',
    },

    // For seventh Page =>
    seventhPageLeftUpperBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '65%',
        height: '20%',
        backgroundColor: '#dfcdc1',
    },
    seventhPageLeftBottomBackground: {
        position: 'absolute',
        top: '20%',
        left: 0,
        width: '65%',
        height: '80%',
        backgroundColor: '#efe6dc',
    },
    seventhPageRightBackground: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '45%',
        height: '100%',
        backgroundColor: '#728478',
    },
    seventhPageImageContainer: {
        position: 'relative',
        left: '-10px',
        top: '10%',
        width: '80%',
        height: '40%',
        border: '10px solid #efe6dc'
    },
    seventhPageImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    seventhPageProductPriceContainer: {
        position: 'absolute',
        top: '70%',
        right: '10%',
        // backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px'
    },
    seventhPageProductPrice: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    seventhPageContentContainer: {
        position: 'absolute',
        top: '55%',
        left: '5%',
        width: '45%',
        height: '40%',
        display: 'flex',
        justifyContent: 'space-evenly',
        backgroundColor: '#5b5f62',
        color: '#eeefea',
        padding: '20px'
    },
    seventhPageProductName: {
        fontSize: 35,
    },
    seventhPageProdutDescription: {
        fontSize: 15,
    },
    seventhPageTopRoundOne: {
        position: 'absolute',
        top: '-400px',
        right: '-750px',
        width: '900px',
        height: '1000px',
        borderRadius: '100%',
        border: '5px solid #5b5f62'
    },
    seventhPageTopRoundTwo: {
        position: 'absolute',
        top: '-450px',
        right: '-650px',
        width: '900px',
        height: '950px',
        borderRadius: '100%',
        border: '2px solid #5b5f62'
    },
    seventhPageTopShapeContainer: {
        position: 'absolute',
        top: '0%',
        right: '-180px',
        width: '50%',
        height: '40%',
        transform: 'rotate(80deg)',
    },



    // For eight Page =>
    eightPageleftBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '70%',
        height: '100%',
        backgroundColor: '#f5efe3',
    },
    eightPageRightBackground: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '30%',
        height: '100%',
        backgroundColor: '#5b5f62',
    },

    eightPageImageContainer: {
        position: 'relative',
        left: '10%',
        top: '10%',
        width: '50%',
        height: '50%',
        border: '10px solid white'
    },
    eightPageImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    eightPageProductPriceContainer: {
        position: 'absolute',
        top: '70%',
        right: '10%',
        // backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px'
    },
    eightPageProductPrice: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    eightPageContentContainer: {
        position: 'absolute',
        top: '65%',
        right: 0,
        width: '80%',
        height: '25%',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#728478',
        color: '#eeefea',
        padding: '20px 200px 20px 20px'
    },
    eightPageProductName: {
        fontSize: 35,
    },
    eightPageProdutDescription: {
        fontSize: 15,
    },
    eightPageTopRoundOne: {
        position: 'absolute',
        top: '-400px',
        right: '-750px',
        width: '900px',
        height: '1000px',
        borderRadius: '100%',
        border: '5px solid #e7d3c5'
    },
    eightPageTopRoundTwo: {
        position: 'absolute',
        top: '-450px',
        right: '-650px',
        width: '900px',
        height: '950px',
        borderRadius: '100%',
        border: '2px solid #e7d3c5'
    },
    eightPageTopShapeContainer: {
        position: 'absolute',
        top: '-140px',
        right: '-100px',
        width: '70%',
        height: '25%',
        transform: 'rotate(180deg)',
    },

    // For ninth Page =>
    ninthPageBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#5b5f62',
    },

    ninthPageImageContainer: {
        position: 'relative',
        left: '10%',
        top: '10%',
        width: '80%',
        height: '80%',
        border: '10px solid white'
    },
    ninthPageImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    ninthPageProductPriceContainer: {
        position: 'absolute',
        top: '70%',
        right: '10%',
        // backgroundColor: '#323230',
        color: '#eeefea',
        padding: '10px'
    },
    ninthPageProductPrice: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    ninthPageContentContainer: {
        position: 'absolute',
        top: '55%',
        left: 0,
        width: '60%',
        height: '30%',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#728478',
        color: '#eeefea',
        padding: '20px 20px 20px 60px'
    },
    ninthPageProductName: {
        fontSize: 35,
    },
    ninthPageProdutDescription: {
        fontSize: 15,
    },
    ninthPageTopRoundOne: {
        position: 'absolute',
        top: '-600px',
        left: '-130px',
        width: '900px',
        height: '1000px',
        borderRadius: '100%',
        border: '5px solid #efe6dc'
    },
    ninthPageTopRoundTwo: {
        position: 'absolute',
        top: '-650px',
        left: '-250px',
        width: '900px',
        height: '950px',
        borderRadius: '100%',
        border: '2px solid #efe6dc'
    },
    ninthPageBottomShapeContainer: {
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '70%',
        height: '25%',
        transform: 'rotate(180deg)',
    },



    // Last Page Style =>

    lastPageTopBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '50%',
        backgroundColor: '#efe6dc',
    },

    lastPageBackground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        // backgroundColor: '#f8d4c1',
        backgroundColor: '#c4ad95',
        width: '100%',
        height: '50%',
    },

    lastPageLogoImageContainer: {
        position: 'relative',
        top: '-20%',
        width: '40%',
        height: 'auto',
        margin: 'auto',
    },

    lastPageContentContainer: {
        position: 'absolute',
        bottom: 0,
        left: '20%',
        width: '60%',
        height: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        textAlign: 'center',
        gap: 15,
    },
    lastPageManagerDetailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        fontSize: 15,

    },
    lastPageManagerNameAndNumberContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '30px'
    },
    lastPageStoreDetailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        fontSize: 15,
    },
    lastpageCopyright: {
        margin: 'auto',
        fontSize: 10,
    },
    socialLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginTop: 80,
    },
    icon: {
        width: 24,
        height: 24,
    },



});

export const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.firstPageBackground} />
            <View style={styles.firstPageBottomRightContainer} />
            <View style={styles.firstPageBottomShapeContainer} >
                <Image
                    style={styles.firstPageBottomShape}
                    src="/images/shape1.png"
                />
            </View>
            <View style={styles.firstPageUpperLeftContainer} >
                <View style={styles.firstPageMainImageContainer}>
                    <Image
                        style={styles.firstPageMainImage}
                        src="/images/frontPageImage.jpg"
                    />
                </View>
            </View>
            <View style={styles.logoImageContainer}>
                <Image
                    style={styles.logoImage}
                    src="/images/logo.png"
                />
            </View>
            <View style={[styles.greetingContainer]} >
                <Text style={styles.greeting}>Hello, </Text>
            </View>
            <View style={[styles.customerNameContainer]} >
                <Text style={styles.customerName}>Deepak Sharma</Text>
            </View>
            <View style={[styles.customerMessageContainer]} >
                <Text style={styles.customerMessage}>Based on your interests and recent activities, we’ve carefully curated a range of items that we believe you’ll love. Whether you’re looking for something specific or just browsing, we hope you find inspiration within these pages.</Text>
            </View>
            <View style={styles.firstPageTopRoundOne} />
            <View style={styles.firstPageTopRoundTwo} />
            <View style={styles.firstPageTopRoundThree} />
            <View style={styles.firstPageBottomRoundOne} />
            <View style={styles.firstPageBottomRoundTwo} />
        </Page>

        {/* Second Page */}
        <Page size="A4" style={styles.page}>
            <View style={styles.secondPageBackground} />
            <View style={styles.secondPageTopContainer} />
            <View style={styles.secondPageBottomRoundOne} />
            <View style={styles.secondPageBottomRoundTwo} />
            <View style={styles.secondPageTopUpperContainer} />
            <View style={styles.secondPageImageContainer}>
                <Image
                    style={styles.secondPageImage}
                    src="/images/secondPageImage.jpg"
                />
            </View>
            <View style={styles.secondPageProductPriceContainer}>
                <Text style={styles.secondPageProductPrice}>$199.99</Text>
            </View>
            <View style={styles.secondPageBottomContentContainer}>
                <Text style={styles.secondPageProductName}>Blackberry Jacket</Text>
                <Text style={styles.secondPageProdutDescription}>blackberrys Men's Urban Slim Fit High Neck Sweat-Shirt-UE-SS-LICH.</Text>
            </View>
        </Page>

        {/* Third Page */}
        <Page size="A4" style={styles.page}>
            <View style={styles.thirdPageLeftBackground} />
            <View style={styles.thirdPageRightBackground} />

            <View style={styles.thirdPageBottomRoundOne} />
            <View style={styles.thirdPageBottomRoundTwo} />
            <View style={styles.thirdPageBottomShapeContainer} >
                <Image
                    style={styles.thirdPageBottomShape}
                    src="/images/shape2.png"
                />
            </View>
            <View style={styles.thirdPageImageContainer}>
                <Image
                    style={styles.thirdPageImage}
                    src="/images/secondPageImage.jpg"
                />
            </View>
            <View style={styles.thirdPageProductPriceContainer}>
                <Text style={styles.thirdPageProductPrice}>$199.99</Text>
            </View>
            <View style={styles.thirdPageBottomContentContainer}>
                <Text style={styles.thirdPageProductName}>Blackberry Jacket</Text>
                <Text style={styles.thirdPageProdutDescription}>blackberrys Men's Urban Slim Fit High Neck Sweat-Shirt-UE-SS-LICH.</Text>

            </View>
        </Page>

        {/* Fourth Page */}
        <Page size="A4" style={styles.page}>
            <View style={styles.fourthPageTopBackground} />
            <View style={styles.fourthPageBottomBackground} />

            <View style={styles.fourthPageBottomRoundOne} />
            <View style={styles.fourthPageBottomRoundTwo} />
            <View style={styles.fourthPageBottomShapeContainer} >
                <Image
                    style={styles.fourthPageBottomShape}
                    src="/images/shape2.png"
                />
            </View>
            <View style={styles.fourthPageImageContainer}>
                <Image
                    style={styles.fourthPageImage}
                    src="/images/secondPageImage.jpg"
                />
            </View>
            <View style={styles.fourthPageTopRoundOne} />
            <View style={styles.fourthPageTopRoundTwo} />
            <View style={styles.fourthPageProductPriceContainer}>
                <Text style={styles.fourthPageProductPrice}>$199.99</Text>
            </View>


            <View style={styles.fourthPageProductNameContainer}>
                <Text style={styles.fourthPageProductName}>Blackberry Jacket</Text>
            </View>
            <View style={styles.fourthPageProdutDescriptionContainer}>
                <Text style={styles.fourthPageProdutDescription}>blackberrys Men's Urban Slim Fit High Neck Sweat-Shirt-UE-SS-LICH.</Text>

            </View>
        </Page>

        {/* Fifth Page */}
        <Page size="A4" style={styles.page}>
            <View style={styles.fifthPageBackground} />
            <View style={styles.fifthPageRightBackground} />

            <View style={styles.fifthPageTopRoundOne} />
            <View style={styles.fifthPageTopRoundTwo} />
            <View style={styles.fifthPageTopShapeContainer} >
                <Image
                    style={styles.fifthPageTopShape}
                    src="/images/shape1.png"
                />
            </View>
            <View style={styles.fifthPageImageContainer}>
                <Image
                    style={styles.fifthPageImage}
                    src="/images/secondPageImage.jpg"
                />
            </View>
            <View style={styles.fifthPageProductPriceContainer}>
                <Text style={styles.fifthPageProductPrice}>$199.99</Text>
            </View>
            <View style={styles.fifthPageContentContainer}>
                <Text style={styles.fifthPageProductName}>Blackberry Jacket</Text>
                <Text style={styles.fifthPageProdutDescription}>blackberrys Men's Urban Slim Fit High Neck Sweat-Shirt-UE-SS-LICH.</Text>

            </View>
        </Page>

        {/* Sixth Page */}
        <Page size="A4" style={styles.page}>
            <View style={styles.sixthPageTopBackground} />
            <View style={styles.sixthPageBottomBackground} />

            <View style={styles.sixthPageBottomShapeContainer} >
                <Image
                    style={styles.sixthPageBottomShape}
                    src="/images/shape2.png"
                />
            </View>
            <View style={styles.sixthPageImageContainer}>
                <Image
                    style={styles.sixthPageImage}
                    src="/images/secondPageImage.jpg"
                />
            </View>
            <View style={styles.sixthPageBottomRoundOne} />
            <View style={styles.sixthPageBottomRoundTwo} />
            <View style={styles.sixthPageTopRoundOne} />
            <View style={styles.sixthPageTopRoundTwo} />
            <View style={styles.sixthPageProductPriceContainer}>
                <Text style={styles.sixthPageProductPrice}>$199.99</Text>
            </View>


            <View style={styles.sixthPageProductNameContainer}>
                <Text style={styles.sixthPageProductName}>Blackberry Jacket</Text>
            </View>
            <View style={styles.sixthPageProdutDescriptionContainer}>
                <Text style={styles.sixthPageProdutDescription}>blackberrys Men's Urban Slim Fit High Neck Sweat-Shirt-UE-SS-LICH.</Text>

            </View>
        </Page>

        {/* Seventh Page */}
        <Page size="A4" style={styles.page}>
            <View style={styles.seventhPageLeftUpperBackground} />
            <View style={styles.seventhPageLeftBottomBackground} />
            <View style={styles.seventhPageRightBackground} />

            <View style={styles.seventhPageTopShapeContainer} >
                <Image
                    style={styles.seventhPageTopShape}
                    src="/images/shape1.png"
                />
            </View>
            <View style={styles.seventhPageImageContainer}>
                <Image
                    style={styles.seventhPageImage}
                    src="/images/secondPageImage.jpg"
                />
            </View>
            <View style={styles.seventhPageTopRoundOne} />
            <View style={styles.seventhPageTopRoundTwo} />
            <View style={styles.seventhPageProductPriceContainer}>
                <Text style={styles.seventhPageProductPrice}>$199.99</Text>
            </View>
            <View style={styles.seventhPageContentContainer}>
                <Text style={styles.seventhPageProductName}>Blackberry Jacket</Text>
                <Text style={styles.seventhPageProdutDescription}>blackberrys Men's Urban Slim Fit High Neck Sweat-Shirt-UE-SS-LICH.</Text>
            </View>
        </Page>
        {/* eight Page */}
        <Page size="A4" style={styles.page}>
            <View style={styles.eightPageLeftBackground} />
            <View style={styles.eightPageRightBackground} />
            <View style={styles.eightPageTopShapeContainer} >
                <Image
                    style={styles.eightPageTopShape}
                    src="/images/shape1.png"
                />
            </View>
            <View style={styles.eightPageImageContainer}>
                <Image
                    style={styles.eightPageImage}
                    src="/images/secondPageImage.jpg"
                />
            </View>
            <View style={styles.eightPageTopRoundOne} />
            <View style={styles.eightPageTopRoundTwo} />

            <View style={styles.eightPageContentContainer}>
                <Text style={styles.eightPageProductName}>Blackberry Jacket</Text>
                <Text style={styles.eightPageProdutDescription}>blackberrys Men's Urban Slim Fit High Neck Sweat-Shirt-UE-SS-LICH.</Text>
                <Text style={styles.eightPageProductPrice}>$199.99</Text>
            </View>
        </Page>

        {/* ninth Page */}
        <Page size="A4" style={styles.page}>
            <View style={styles.ninthPageBackground} />
            <View style={styles.ninthPageTopRoundOne} />
            <View style={styles.ninthPageTopRoundTwo} />
            <View style={styles.ninthPageBottomShapeContainer} >
                <Image
                    style={styles.ninthPageTopShape}
                    src="/images/shape1.png"
                />
            </View>
            <View style={styles.ninthPageImageContainer}>
                <Image
                    style={styles.ninthPageImage}
                    src="/images/secondPageImage.jpg"
                />
            </View>

            <View style={styles.ninthPageContentContainer}>
                <Text style={styles.ninthPageProductName}>Blackberry Jacket</Text>
                <Text style={styles.ninthPageProdutDescription}>blackberrys Men's Urban Slim Fit High Neck Sweat-Shirt-UE-SS-LICH.</Text>
                <Text style={styles.ninthPageProductPrice}>$199.99</Text>
            </View>
        </Page>




        {/* Last Page */}
        <Page size="A4" style={styles.page}>
            <View style={styles.lastPageBackground} />
            <View style={styles.lastPageTopBackground} />
            <View style={styles.lastPageLogoImageContainer}>
                <Image
                    style={styles.lastPageLogoImage}
                    src="/images/logo.png"
                />
            </View>
            <View style={styles.lastPageContentContainer}>

                <View style={styles.lastPageManagerDetailsContainer}>
                    <View style={styles.lastPageManagerNameAndNumberContainer}>
                        <Text style={styles.lastPageManagerName}>Pranjal Sengar</Text>
                        <Text style={styles.lastPageManagerPhoneNumber}>+1234567890</Text>
                    </View>
                    <View style={styles.lastPageManagerEmailContainer}>
                        <Text style={styles.lastPageManagerName}>Pranjal.Sengar@gmail.com</Text>
                    </View>
                </View>
                <View style={styles.lastPageStoreDetailsContainer}>

                    <View style={styles.storeLocationContainer}>
                        <Text style={styles.storeLocation}>Shop No D232B, Mall of India, Plot No M/3. Sector 18. Noida - 201301 .</Text>
                    </View>


                    <View style={styles.socialLinks}>
                        <Link src="https://www.facebook.com/login.php" style={styles.iconLink}>
                            <Image
                                src="/images/facebookLogoBlack.png"
                                style={styles.icon}
                                alt="Facebook"
                            />
                        </Link>
                        <Link src="https://www.instagram.com/accounts/login/" style={styles.iconLink}>
                            <Image
                                src="/images/instagramLogoBlack.png"
                                style={styles.icon}
                                alt="Instagram"
                            />
                        </Link>
                        <Link src="https://x.com/i/flow/login?input_flow_data=%7B%22requested_variant%22%3A%22eyJteCI6IjIifQ%3D%3D%22%7D" style={styles.iconLink}>
                            <Image
                                src="/images/twitterLogoBlack.png"
                                style={styles.icon}
                                alt="Twitter"
                            />
                        </Link>
                        <Link src="https://discord.com/login" style={styles.iconLink}>
                            <Image
                                src="/images/discordLogoBlack.png"
                                style={styles.icon}
                                alt="Discord"
                            />
                        </Link>
                    </View>
                    <View style={styles.storeCopyrightContainer}>

                        <Text style={styles.lastpageCopyright}>
                            © 2021-2022 Fixlabs™. All Rights Reserved. Built with
                        </Text>
                    </View>

                </View>

            </View>
        </Page>

    </Document>
);





const PersonalizedThird = () => (
    <div>
        <PDFDownloadLink document={<MyDocument />} fileName="any.pdf">
            {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Download now!'
            }
        </PDFDownloadLink>


        <div style={{ width: '100%', height: '100vh' }}>
            <PDFViewer style={{ width: '100%', height: '100%' }}>
                <MyDocument />
            </PDFViewer>
        </div>
    </div>
);



export default PersonalizedThird;
