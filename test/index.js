import test from 'tape';
import init from '../build/index';

test('prueba fichero existe', (t) => {
  t.same(init(), true,
    'it should be true');
  t.end();
});
