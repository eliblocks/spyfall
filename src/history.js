import { createBrowserHistory } from 'history';
import useQueries from 'history/lib/useQueries';

export default useQueries(createHistory)();
