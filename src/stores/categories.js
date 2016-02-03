import alt from '/../alt';

class CategoriesStore {
  constructor() {
    this.state = {
      categories: [
        'Museums',
        'Theaters',
        'Parks',
        'Viewpoints'
      ]
    };
  }
};

export default alt.createStore(CategoriesStore, 'CategoriesStore');
