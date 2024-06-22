import styled from 'styled-components';

export const DivSwiper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    max-height: 500px;
    justify-content: center;
    .mySwiperCoverflow {
        .swiper-slide,
        swiper-slide {
            width: 33.2% !important;
        }
        .swiper,
        swiper-container {
            position: unset !important;
            overflow: unset !important;
        }
        .swiper-pagination {
            top: unset !important;
            bottom: -10px !important;
            height: 10px !important;
        }
        .swiper-wrapper {
            align-items: center;
        }
        .swiper {
            width: 100%;
        }
    }

    ${(props: { css?: string }) => props.css}
`;
export const InputT = styled.input`
    width: 100%;
    padding: 3px;
    margin: 5px 0;
    background-color: transparent;
    color: aliceblue;
`;
export const TextA = styled.input``;
