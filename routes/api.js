var express = require('express');
var router = express.Router();

var limits = {};

setInterval(() => {
  api.sendRequestCounts(limits).then(() => {
    limits = {};
  })
}, 60000);

function getRequestObject(arr, query) {
  for (var i = 0; i < arr.length; i++) {
    if (query[arr[i]] != undefined) {
      return {[arr[i]]: query[arr[i]]};
    }
  }
  return null;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.sendStatus(200);
});

router.get('/status', function(req, res, next) {
  api.isValidKey(req.query.key).then(valid => {
    if (!valid) {
      return res.sendStatus(401);
    } else if (limits[req.query.key] != undefined && limits[req.query.key] >= 60) {
      return res.sendStatus(429);
    } else {
      if (limits[req.query.key] == undefined) {
        limits[req.query.key] = 0;
      }
      limits[req.query.key]++;
    }

    api.getServerDetails().then((server) => {
      return res.status(200).send(server);
    });

  });
})

router.get('/fetch/player', function(req, res, next) {
  api.isValidKey(req.query.key).then(valid => {
    if (!valid) {
      return res.sendStatus(401);
    } else if (limits[req.query.key] != undefined && limits[req.query.key] >= 60) {
      return res.sendStatus(429);
    } else {
      if (limits[req.query.key] == undefined) {
        limits[req.query.key] = 0;
      }
      limits[req.query.key]++;
    }

    let q = getRequestObject(["uuid","username"], req.query);
    if (q == null) {
      return res.sendStatus(400);
    } else {
      api.getPlayer(q).then(response => {
        return res.status(200).send(response);
      })
    }
  })
});

router.get('/fetch/nation', function(req, res, next) {
  api.isValidKey(req.query.key).then(valid => {
    if (!valid) {
      return res.sendStatus(401);
    } else if (limits[req.query.key] != undefined && limits[req.query.key] >= 60) {
      return res.sendStatus(429);
    } else {
      if (limits[req.query.key] == undefined) {
        limits[req.query.key] = 0;
      }
      limits[req.query.key]++;
    }

    let q = getRequestObject(["id","name"], req.query);
    if (q == null) {
      return res.sendStatus(400);
    } else {
      api.getNation(q).then(response => {
        return res.status(200).send(response);
      })
    }
  })
});

router.get('/fetch/town', function(req, res, next) {
  api.isValidKey(req.query.key).then(valid => {
    if (!valid) {
      return res.sendStatus(401);
    } else if (limits[req.query.key] != undefined && limits[req.query.key] >= 60) {
      return res.sendStatus(429);
    } else {
      if (limits[req.query.key] == undefined) {
        limits[req.query.key] = 0;
      }
      limits[req.query.key]++;
    }

    let q = getRequestObject(["id","name"], req.query);
    if (q == null) {
      return res.sendStatus(400);
    } else {
      api.getTown(q).then(response => {
        return res.status(200).send(response);
      })
    }
  })
});

let possibleTypesForEntities = {
  nation: ["players", "towns", "provinces", "battles", "plots"],
  province: ["players", "towns"],
  town: ["players", "plots"]
}

router.get('/get/:type/in/:entity', function(req, res, next) {
  api.isValidKey(req.query.key).then(valid => {
    if (!valid) {
      return res.sendStatus(401);
    } else if (limits[req.query.key] != undefined && limits[req.query.key] >= 60) {
      return res.sendStatus(429);
    } else {
      if (limits[req.query.key] == undefined) {
        limits[req.query.key] = 0;
      }
      limits[req.query.key]++;
    }

    if (req.params.type == null || req.params.entity == null || req.query.id == null) return res.sendStatus(400);
    let type = req.params.type.toLowerCase();
    let entity = req.params.entity.toLowerCase();

    if (possibleTypesForEntities[entity] == undefined || !possibleTypesForEntities[entity].includes(type)) return res.sendStatus(400);


    api.getSomethingOfSomething(type, entity, {id: req.query.id}).then(response => {
      return res.status(200).send(response);
    })


  });


});

module.exports = router;
