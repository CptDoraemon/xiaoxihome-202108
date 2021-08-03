import testImage from '../../assets/test.jpeg';
import testImage1 from '../../assets/test1.jpg';

export interface TimelineDataItem {
  year: number,
  title: string,
  description: string,
  images: Array<StaticImageData>
}

const timelineData: TimelineDataItem[] = [
  {
    year: 2021,
    title: 'title',
    description: 'description description description description description sdgbdbxcvz dsf ADSB XCB Sdg szb xcvzxcv',
    images: [testImage, testImage]
  },
  {
    year: 2021,
    title: 'long long long long long long long long long title',
    description: 'description description description description description',
    images: [testImage1, testImage]
  },
  {
    year: 2021,
    title: 'title',
    description: 'description description description description description',
    images: [testImage, testImage]
  },
  {
    year: 2021,
    title: 'title',
    description: 'description description description description description',
    images: [testImage, testImage]
  },
  {
    year: 2020,
    title: 'title',
    description: 'description description description description description',
    images: [testImage, testImage]
  },
  {
    year: 2019,
    title: 'title',
    description: 'description description description description description',
    images: [testImage, testImage]
  }
];

export default timelineData
