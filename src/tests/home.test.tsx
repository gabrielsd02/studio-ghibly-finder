import renderer from 'react-test-renderer';
import Home from '../pages/Home';

test('renders correctly', () => {
  const component = renderer.create(<Home />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});