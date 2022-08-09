const express = require('express');
const router = express.Router();
const ArticleModel = require('../../models/Article');

const PAGE_SIZE = 5;

const checkLogin = require('../user/checkLogin');
const checkRoles = require('../user/checkRoles');

function randomString(length) {
    const s = 'zxcvbnmasdfghjklqwertyuiop1234567890';
    let result = '';
    for (let i = 0; i < length; i++){
        result += s[Math.floor(Math.random() * s.length)];
    }
    return result;
}

function stringToSlug(str) {
  // remove accents
  var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
      to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i=0, l=from.length ; i < l ; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-');

  return str;
}

function getPermalink(tit, username) {
    const titles = stringToSlug(tit).split('-');
    titles.push(username);
    titles.push(randomString(20));
    return titles.join('-');
}

router.get('/', (req, res, next) => {
    const page = parseInt(req.query.page);
    if (page < 1)
        page = 1;
    ArticleModel.count({})
        .then(data => {
            return data;
        })
        .then(count => {
            if (page * PAGE_SIZE < count)
                return {
                    next: true,
                    count: count
                };
            else
                return {
                    next: false,
                    count: count
                };
            
        })
        .then(data => {
            ArticleModel.find({})
                .skip((page - 1) * PAGE_SIZE)
                .limit(PAGE_SIZE)
                .then(data => res.status(200).json({
                    success: true,
                    pages: Math.ceil(data.count / PAGE_SIZE),
                    next: data.next,
                    data: data
                }));
    })
    
});


router.get('/:permalink', (req, res, next) => {
    ArticleModel.findOne({
        permalink: req.params.permalink
    }).then(data => {
        res.status(200).json({
            success: true,
            data: data
        });
    }).catch(next);
})


router.post('/', checkLogin, (req, res, next) => {
    const dataCreate = {
        title: req.body.title,
        body: req.body.body,
        author_id: res.data._id,
        tags: req.body.tags.split(',').map(value => {
            return value.trim();
        }),
        permalink: getPermalink(req.body.title.trim(), res.data.username)
    };
    ArticleModel.create(dataCreate)
        .then(data => {
            res.status(200).json({
                success: true
            });
        })
        .catch(next);
});

router.put('/:permalink', checkLogin, (req, res, next) => {
    ArticleModel.findOneAndUpdate({
        permalink: req.params.permalink,
        author_id: res.data._id
    }, {
        title: req.body.title,
        permalink: getPermalink(req.body.title, res.body.username),
        body: req.body.body,
        tags: req.body.tags.split(',').map(value => value.trim())
    })
        .then(data => {
            res.status(200).json({
                success: true
            });
        })
        .catch(next);
});


router.put('/:permalink', checkLogin, checkRoles.checkAdmin, (req, res, next) => {
    ArticleModel.findOneAndUpdate({
        permalink: req.params.permalink
    }, {
        title: req.body.title,
        permalink: getPermalink(req.body.title, res.body.username),
        body: req.body.body,
        tags: req.body.tags.split(',').map(value => value.trim())
    })
        .then(data => {
            res.status(200).json({
                success: true
            });
        })
        .catch(next);
});


router.delete('/:permalink', checkLogin, (req, res, next) => {
    ArticleModel.findOneAndDelete({
        permalink: req.params.permalink,
        author_id: res.data._id
    })
        .then(data => {
            res.status(200).json({
                success: true,
                data: data
            });
        })
        .catch(next);
});


router.delete('/:permalink', checkLogin, checkRoles.checkAdmin, (req, res, next) => {
    ArticleModel.findOneAndDelete({
        permalink: req.params.permalink
    })
        .then(data => {
            res.status(200).json({
                success: true
            });
        })
        .catch(next);
});

module.exports = router;