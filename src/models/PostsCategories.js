module.exports = (sequelize, _DataTypes) => {
  const PostsCategories = sequelize.define('PostsCategories', {}, {
    timestamps: false, tableName: 'PostsCategories',
  });

  PostsCategories.associate = (models) => {
    models.BlogPosts.belongsToMany(models.Categories, {
      as: 'categories',
      through: PostsCategories,
      foreignKey: 'postsId',
      otherKey: 'categoryId',
    });
    models.Categories.belongsToMany(models.Categories, {
      as: 'posts',
      through: PostsCategories,
      foreignKey: 'categoryId',
      otherKey: 'postsId',
    });
  };

  return PostsCategories;
};